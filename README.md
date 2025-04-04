# Molly: A Crowdsourced, Simplified Recipe Catalogue.

## Why Molly?

I love cooking, but many others, including my wife, absolutely hate it. Finding recipes usually involves visiting cheesy blog sites full of ads, organizing a shopping list is a hassle, especially if some of the ingredients aren't available locally, and the cooking process itself can go pear-shaped at the drop of a hat, leaving inexperienced cooks frustrated, demotivated, and hungry.

Molly is a long-term project intended to address many of these common hurdles, one solution at a time.

### Recipes without the clutter

In my research I discovered [Just The Recipe](https://www.justtherecipe.com/), and while this is an incredibly useful website I decided to improve on this idea in two key areas:

- **Persistence:** Imported recipes are now stored in a database, allowing users to browse an ever-expanding catalogue of recipes in one centralized location.
- **Performance:** Just The Recipe sometimes feels slow and sluggish to use, so while it solves one problem rather well it presents a somewhat similar problem to the end user. Molly's tech stack and system architecture were chosen to facilitate fast, smooth recipe imports.

I will update this section as more features are implemented.

## Roadmap

- Enhanced search and filtering options
- Guided recipes
- User accounts
- Recipe collections
- Shopping lists

## Quick Start

Click [here](https://molly.davidslade.dev/) to visit the live demo.

## Usage

### Import recipes

Importing recipes is easy. Head over to your favorite recipe blog, find something you like, and paste the link into the form. Molly will declutter the recipe and leave you with just the important parts.

### Browsing

Recipes you import will be saved into the catalogue for everyone else, so in that way Molly is an aggregator that anyone can contribute to.

## Developers

To facilitate good performance and seamless development of new features, Molly uses a distributed backend solution. Below are an outline of the microservices that make up this system.

### Molly Recipes

This is a gRPC server written in Go that communicates with the scraper and server, and relies on a PostgreSQL database to store and retrieve recipe data.

### Molly Scraper

The scraper is built with Python and depends on the fantastic [Recipe Scrapers](https://github.com/hhursev/recipe-scrapers) library. Subscribing to a RabbitMQ requests queue, the scraper is charged with processing incoming requests, formatting the data to the requirements of the recipes service via NLP and heuristics, calling the recipes service, and delivering results back to the broker.

### Molly Server

The user-friendly gateway of the whole application. Written in Typescript and utilizing the NestJS framework, the server supports RESTful HTTP calls and websocket connections from clients, whilst itself employing gRPC calls and RabbitMQ to communicate with the other services. It also caches successful calls to the Recipe service in-memory to bolster performance.

### Molly Users

In development. This is the authentication service for the application, managing user accounts and access tokens. Written in Nestjs and employs a postgres database via TypeORM.

Molly also supports a web client built on Vite, React, Tanstack Query and ShadCN.
