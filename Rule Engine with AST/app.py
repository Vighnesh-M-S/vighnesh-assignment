from flask import Flask, request, jsonify

app = Flask(__name__)

# Dummy database to hold rules
rules_db = {}

# Function to parse rule string into AST
def create_rule(rule_string):
    # For simplicity, assume the rule string is parsed into an AST manually here
    # In reality, you would have a full parser to handle the syntax
    # Example for rule_string like: (age > 30 AND salary > 50000)
    root = Node("operator", "AND",
                Node("operand", ("age", ">", 30)),
                Node("operand", ("salary", ">", 50000)))
    return root

@app.route('/create_rule', methods=['POST'])
def create_rule_api():
    rule_string = request.json.get('rule_string')
    rule_ast = create_rule(rule_string)
    rule_id = len(rules_db) + 1
    rules_db[rule_id] = rule_ast
    return jsonify({"rule_id": rule_id, "rule_ast": str(rule_ast)})

# Function to combine rules
def combine_rules(rule_list):
    # For now, we use a simple AND to combine the rules
    combined_ast = rule_list[0]
    for rule in rule_list[1:]:
        combined_ast = Node("operator", "AND", combined_ast, rule)
    return combined_ast

@app.route('/combine_rules', methods=['POST'])
def combine_rules_api():
    rule_ids = request.json.get('rule_ids')
    rule_list = [rules_db[rule_id] for rule_id in rule_ids]
    combined_ast = combine_rules(rule_list)
    combined_id = len(rules_db) + 1
    rules_db[combined_id] = combined_ast
    return jsonify({"combined_rule_id": combined_id, "combined_ast": str(combined_ast)})

# Function to evaluate the rule against user data
def evaluate_rule(ast, data):
    if ast.type == "operand":
        field, operator, value = ast.value
        return eval(f"{data[field]} {operator} {value}")
    elif ast.type == "operator":
        left_result = evaluate_rule(ast.left, data)
        right_result = evaluate_rule(ast.right, data)
        if ast.value == "AND":
            return left_result and right_result
        elif ast.value == "OR":
            return left_result or right_result

@app.route('/evaluate_rule/<int:rule_id>', methods=['POST'])
def evaluate_rule_api(rule_id):
    rule_ast = rules_db.get(rule_id)
    user_data = request.json.get('user_data')
    result = evaluate_rule(rule_ast, user_data)
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)
