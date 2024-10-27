# Zeotap Software Engineering Assignment

This repository contains two main projects for the Zeotap Software Engineering Role assignment:

1. **Rule Engine**: A Django-based application for managing and processing custom rules.
2. **Weather App**: A React.js application for displaying weather data.

## Table of Contents
- [Project Overview](#project-overview)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Project Overview

### Rule Engine
The Rule Engine project is a Django application designed to create, manage, and evaluate rules based on custom logic. This can be particularly useful for processing business rules, filtering data, or validating complex conditions.

### Weather App
The Weather App is a frontend application built with Node.js that displays current weather data for various locations. This app fetches weather information via an API and presents it in a user-friendly interface.

## Setup and Installation

### Prerequisites
- Python 3.x for Rule Engine
- Node.js and npm for Weather App

### Rule Engine Setup

1. Navigate to the `Rule_Engine` directory:
   ```bash
   cd Rule_Engine

2. Install dependencies:
   ```bash
   pip install django

3. Set up the database:
   ```bash
   python3 manage.py makemigrations
   python3 manage.py migrate

4. Start the Django development server:
   ```bash
   python3 manage.py runserver

### Weather App Setup

1. Navigate to the weather_app directory:
   ```bash
   cd weather_app

3. Add your weatherApi key.

2. Start the Node.js application:
   ```bash
   npm start

## Usage

- **Rule Engine**: Access the Rule Engine at `http://127.0.0.1:8000` once the server is running.
- **Weather App**: Start the application with `npm start`, and open it in your browser at `http://localhost:3000` to view the weather data interface.

## Project Structure

- `Rule_Engine/`: Contains the Django project for the Rule Engine.
- `weather_app/`: Contains the Node.js weather application.

## Technologies Used

- **Django** for building the Rule Engine backend.
- **Node.js** for creating the Weather App frontend.
- **HTML/CSS** and **JavaScript** for frontend styling and interactivity.




