CREATE TABLE rule (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    rule_ast JSONB, -- Store the AST in JSON format
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_data (
    id SERIAL PRIMARY KEY,
    age INT,
    department VARCHAR(255),
    salary INT,
    experience INT
);
