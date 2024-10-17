# Tiny Linker

**Tiny Linker** is a microservice-based URL shortening platform, designed with modularity and scalability in mind. This project demonstrates the integration of different technologies to build a highly decoupled system, showcasing an implementation of a microservice architecture.

It also includes deployment strategies using Kubernetes, Docker containers, and some automated configurations, for the infrastructure management process.

Checkout the [Wiki page](https://github.com/vybraan/TinyLinker/wiki)

## Key Microservices

### 1. **AuthTL (Authentication for Tiny Linker)**

AuthTL is responsible for user identity management, authentication, and authorization. This service provides full user management capabilities, including role-based access control. Built with ASP.NET Identity and Entity Framework.

### 2. **tldash (Tiny Linker Dashboard)**

The frontend interface of the Tiny Linker ecosystem. tldash is built using React and Next.js. It serves as the central hub for users to manage their shortened URLs, track statistics, and interact with the backend services via API calls. This component integrates with authentication and URL shortening/redirection services.

### 3. **Cache**

Uses Redis for caching the redirections codes to ensure high performance

### 3. **tlshorten**

This microservice is dedicated to generating shortcodes and mapping them to original URLs. It saves these mappings in the database.This service also handles URL redirection. When a user accesses a shortened link (e.g., `https://${baseurl}/tl/{shortcode}`), this service redirects them to the original URL. It also logs click statistics for analytics. This is built with ASP.NET WebAPI (C#).

# Screenshots
![Dashboard](https://github.com/vybraan/TinyLinker/blob/2ce6827835993fcaedd91b41a02b6705d8f0ae42/static/1.png)
