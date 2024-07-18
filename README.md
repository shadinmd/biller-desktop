# Biller Desktop
Biller Desktop is the dedicated point-of-sale (POS) application for the Biller shop management system. Built with Tauri, React, and TailwindCSS, it provides a fast, responsive, and secure interface for staff to manage sales and billing.

# Features

- Efficient POS system for staff use
- Staff authentication and role-based access
- Quick product lookup and billing
- Multiple payment method support
- Receipt generation and printing
- Responsive and intuitive user interface

# Tech Stack

- Framework: Tauri
- Frontend:
    - React
    - TailwindCSS
    - TypeScript
- State Management: Redux
- Backend Integration: RESTful API calls to Biller backend

# Get Started

## Prerequisites

- Node.js v22.5.^
- Rust

## Installation

- Clone the repository:
    ```bash
    git clone https://github.com/shadinmhd/biller-desktop
    ```

- Navigate to the project directory:
    ```bash
    cd biller-desktop
    ```

- Install dependencies:
    ```bash
    npm install
    ```

- Create a .env file:
    ```bash
    cat .env.example > .env.development
    ```
- Edit the .env file with your backend API URL

## Development

- To run the app in development mode:
    ```bash
    npm run tauri dev
    ```

## Building
- To create a production build:
    ```bash
    npm run tauri build
    ```
    
This will create executable files for your operating system in the src-tauri/target/release directory.
Usage

Launch the Biller Desktop application
Log in with your staff credentials
Use the interface to process sale, manage products, and generate bills
