#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from 'axios';

const SEARCH_TOOL: Tool = {
  name: "search_transparenzportal",
  description: "Search for projects and activities in the Transparenzportal",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query for the Transparenzportal"
      },
      limit: {
        type: "number",
        description: "Maximum number of results to return",
        default: 10
      }
    },
    required: ["query"]
  }
};

const server = new Server(
  {
    name: "transparenzportal-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [SEARCH_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "search_transparenzportal") {
    try {
      const { query, limit = 10 } = request.params.arguments as { query: string; limit?: number };
      
      const response = await axios.get(`https://www.transparenzportal.bund.de/api/v1/activities/`, {
        params: {
          lang: 'de',
          title: query,
          limit,
        }
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error searching Transparenzportal: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }

  return {
    content: [{
      type: "text",
      text: `Unknown tool: ${request.params.name}`
    }],
    isError: true
  };
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Transparenzportal MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
}); 