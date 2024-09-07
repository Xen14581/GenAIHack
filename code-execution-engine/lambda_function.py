import sys
import subprocess
import io


def execute_python_code(code, inputs=None):
    # Redirect stdout to capture the output
    original_stdout = sys.stdout
    sys.stdout = output_capture = io.StringIO()

    # Redirect stdin to simulate user inputs
    original_stdin = sys.stdin
    if inputs is not None:
        sys.stdin = io.StringIO(inputs)

    try:
        exec(code)  # Execute the code and capture the output
        output = output_capture.getvalue()
        return output
    except Exception as e:
        return str(e)
    finally:
        sys.stdout = original_stdout
        sys.stdin = original_stdin


def execute_java_code(code):
    try:
        print(
            "this is the code that we have received", code
        )  # Create a temporary Java source file
        with open("/tmp/Main.java", "w") as java_file:
            java_file.write(code)
            # Compile the Java source file
        compile_result = subprocess.run(
            ["javac", "/tmp/Main.java"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print("Compilation result:", compile_result.returncode)
        if compile_result.returncode != 0:
            # Compilation failed, return the error message
            return compile_result.stderr.decode()
        # Run the compiled Java code
        run_result = subprocess.run(
            ["java", "-classpath", "/tmp", "Main"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print("Run result:", run_result.returncode)
        return run_result.stdout.decode()
    except Exception as e:
        return str(e)


def execute_cpp_code(code):
    try:
        print(
            "this is the code that we have received", code
        )  # Create a temporary cpp source file
        with open("/tmp/temp.cpp", "w") as java_file:
            java_file.write(code)
        # Compile the cpp source file
        compile_result = subprocess.run(
            ["g++", "/tmp/tmpp.cpp", "-o", "tmp/temp"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print("Compilation result:", compile_result.returncode)
        if compile_result.returncode != 0:
            # Compilation failed, return the error message
            return compile_result.stderr.decode()
        # Run the compiled Java code
        run_result = subprocess.run(
            ["/tmp/temp"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print("Run result:", run_result.returncode)
        return run_result.stdout.decode()
    except Exception as e:
        return str(e)


def handler(event, context):
    language = event.get("language", "python")
    code = event.get("code", None)
    inputs = event.get("inputs", None)
    if language == "python":
        result = execute_python_code(code, inputs=inputs)
    elif language == "java":
        result = execute_java_code(code)
    elif language == "c++":
        result = execute_cpp_code(code)
    else:
        result = "Unsupported Language: " + language
        return {"message": "Unsupported Language: " + language}, 400
    return {"message": "Ok", "result": result}
