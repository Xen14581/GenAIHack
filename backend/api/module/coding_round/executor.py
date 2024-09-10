import tempfile, os, subprocess

def execute_code(code, input_params=None):
    # Create a temporary file to store the code
    with tempfile.NamedTemporaryFile(delete=False, suffix='.py') as temp_file:
        temp_file.write(code.encode('utf-8'))
        temp_file_path = temp_file.name

    # Prepare to capture output and errors
    try:
        # Use subprocess.run to execute the temporary file
        result = subprocess.run(
            ['python', temp_file_path],
            input=input_params,
            text=True,
            capture_output=True
        )
        
        # Capture standard output and standard error
        output = result.stdout
        error = result.stderr

        if result.returncode == 0:
            return {"result": output}
        else:
            return {"result": error}
    
    finally:
        # Clean up the temporary file
        os.remove(temp_file_path)

# def execute_code(code, input_params):

#     original_stdout = sys.stdout
#     sys.stdout = output_capture = io.StringIO()

#     # Redirect stdin to simulate user inputs
#     original_stdin = sys.stdin
#     if input_params is not None:
#         sys.stdin = io.StringIO(input_params)

#     try:
#         exec(code)  # Execute the code and capture the output
#         output = output_capture.getvalue()
#         return {"result": output}
#     except Exception as e:
#         print("Error in code: ", str(e))
#         return {"error": str(e)}
#     finally:
#         sys.stdout = original_stdout
#         sys.stdin = original_stdin




# def execute_code(code, input_params=None):
#     # Create a temporary file to store the code
#     with tempfile.NamedTemporaryFile(delete=False, suffix='.py') as temp_file:
#         temp_file.write(code.encode('utf-8'))
#         temp_file_path = temp_file.name
        
#     print(temp_file_path)
#     sleep(1000)

#     # Redirect stdout and stdin
#     original_stdout = sys.stdout
#     original_stdin = sys.stdin
    
#     try:
#         # Redirect stdout to capture output
#         sys.stdout = io.StringIO()
        
#         # Redirect stdin to simulate user inputs
#         if input_params is not None:
#             sys.stdin = io.StringIO(input_params)

#         # Execute the code in the temporary file
#         exec(open(temp_file_path).read())
#         output = sys.stdout.getvalue()
#         return {"result": output}
    
#     except Exception as e:
#         return {"error": str(e)}
    
#     finally:
#         # Restore original stdout and stdin
#         sys.stdout = original_stdout
#         sys.stdin = original_stdin
        
#         # Clean up the temporary file
#         os.remove(temp_file_path)




# def execute_code(code, input_params):
#     lambda_payload = {
#         "language": "python",
#         "code": code,
#         "inputs": "\n".join([str(param) for param in input_params]) + "\n",
#     }
#     try:
#         response = requests.post(
#             current_app.config["LAMBDA_FUNCTION_API_URL"],
#             data=json.dumps(lambda_payload),
#             headers={"Content-Type": "application/json"},
#         )
#         lambda_response = response.json()

#     except requests.RequestException as e:
#         return {"error": str(e)}

#     return lambda_response