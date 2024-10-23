import json

class Node:
    def __init__(self, type, value=None, left=None, right=None):
        self.type = type
        self.value = value
        self.left = left
        self.right = right

def create_rule(rule_string):
    tokens = tokenize(rule_string)
    ast = parse(tokens)
    return ast

def tokenize(rule_string):
    tokens = rule_string.replace("(", " ( ").replace(")", " ) ").split()
    return tokens

def parse(tokens):
    if tokens[0] == "(":
        tokens = tokens[1:]
        left = parse(tokens)
        tokens = tokens[1:]  # Skip the operator
        right = parse(tokens)
        return Node("operator", left=left, right=right)
    elif tokens[0] in ["AND", "OR"]:
        return Node("operator", value=tokens[0])
    else:
        return Node("operand", value=tokens[0])

def combine_rules(rules):
    root = Node("operator", value="AND")
    for rule in rules:
        ast = create_rule(rule)
        root.left = ast
        root = Node("operator", value="AND", left=root)
    return root

def evaluate_rule(ast, data):
    if ast.type == "operand":
        if ast.value in data:
            return data[ast.value]
        else:
            return False
    elif ast.type == "operator":
        if ast.value == "AND":
            return evaluate_rule(ast.left, data) and evaluate_rule(ast.right, data)
        elif ast.value == "OR":
            return evaluate_rule(ast.left, data) or evaluate_rule(ast.right, data)
    return False

# Test cases
if __name__ == "__main__":
    rule1 = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
    rule2 = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"

    ast1 = create_rule(rule1)
    ast2 = create_rule(rule2)

    combined_ast = combine_rules([rule1, rule2])

    data = {"age": 35, "department": "Sales", "salary": 60000, "experience": 3}
    result = evaluate_rule(combined_ast, data)
    print(result)  # Should print True or False based on the rules