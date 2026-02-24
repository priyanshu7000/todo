#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== To-Do Application Setup ===${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found${NC}"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}Warning: PostgreSQL client not found. Make sure PostgreSQL server is running.${NC}"
fi

echo -e "\n${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Backend installation failed. Exiting...${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend dependencies installed${NC}\n"

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd ../frontend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Frontend installation failed. Exiting...${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend dependencies installed${NC}\n"

echo -e "${YELLOW}Running database migration...${NC}"
cd ../backend
npm run migrate

if [ $? -ne 0 ]; then
    echo -e "${RED}Database migration failed. Exiting...${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Database migration completed${NC}\n"

echo -e "${YELLOW}Seeding database...${NC}"
npm run seed

if [ $? -ne 0 ]; then
    echo -e "${RED}Database seeding failed. Exiting...${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Database seeding completed${NC}\n"

echo -e "${GREEN}=== Setup Complete! ===${NC}\n"
echo -e "${YELLOW}Starting applications...${NC}\n"

echo -e "${GREEN}Backend running at:${NC} http://localhost:5000"
echo -e "${GREEN}Frontend running at:${NC} http://localhost:5173"
echo -e "${GREEN}API Documentation:${NC} http://localhost:5000/api-docs\n"

echo -e "${YELLOW}Demo Credentials:${NC}"
echo -e "  Email: ${GREEN}demo@example.com${NC}"
echo -e "  Password: ${GREEN}password123${NC}\n"

# Start backend
npm run dev &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✓ Backend and Frontend started successfully${NC}\n"
echo -e "${YELLOW}Press Ctrl+C to stop both services${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
