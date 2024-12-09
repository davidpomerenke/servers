# Transparenzportal MCP Server

An MCP server implementation that provides access to the German Transparenzportal API for querying project and activity data.

## Features

- Search projects and activities in the Transparenzportal
- Filter results by language and title
- Configurable result limits
- Structured response format

## Tools

- **search_transparenzportal**
  - Search for projects in the Transparenzportal
  - Inputs:
    - `query` (string): Search terms
    - `limit` (number, optional): Maximum number of results (default: 10)
  - Returns: Structured JSON response with matching projects

## Installation
