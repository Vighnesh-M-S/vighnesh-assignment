class Node:
    def __init__(self, node_type, value=None, left=None, right=None):
        self.type = node_type  # "operator" or "operand"
        self.value = value  # e.g., ">", "AND", age, etc.
        self.left = left  # Left child for operators
        self.right = right  # Right child for operators

    def __repr__(self):
        if self.type == "operand":
            return f"Operand({self.value})"
        return f"Operator({self.value}, Left: {self.left}, Right: {self.right})"
