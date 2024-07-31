# Task Manager

This repository consists of Frontend and Backend repos of Task Manager App. This app helps you to managing your tasks with a better UI and quick features.

## Live Link

https://tmapp-client.vercel.app

## Features

- Create tasks.
- Set due dates and priorities for tasks.
- Track the progress of tasks using a visual dashboard.

## Installation

To get started with Task Manager, follow these steps:

### Clone this repository to your local machine.

#### Backend Setup:

- `cd server` to get into server app.
- Install the required dependencies using `npm install`.
- Add the following variables into `.env`
  - `MONGO_URI=your-mongo-db-url`
  - `SECRET_TOKEN=secret`
  - `PORT=4000`

#### Frontend Setup:

- `cd tmapp` to get into tmapp nextjs project.
- Install the required dependencies using `npm install`.
- Add the following variables to `.env`
  - `NEXT_PUBLIC_BACKEND_URI=http://localhost:4000`.

## Usage

Once the application is up and running, you can access it through your web browser. Here are some key actions you can perform:

- Test credentials ( email: admin@workflo.com, password: admin@123 ) are set by default in the login page.
- Directly login with them. Or you may create a new account from the SignUp page.
- Create a new task by clicking on the "Create Task" button.
- Set due dates and priorities for tasks to manage your workload effectively.
- Use the dashboard to track the progress of tasks and identify bottlenecks.
- Use Drag and Drop feature to quickly organize tasks with database sync.
