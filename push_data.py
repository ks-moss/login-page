import os
from github import Github

# GitHub repository information
repository_owner = "ks-moss"  # Replace with the organization or user
repository_name = "login-page"  # Replace with the repository name
username = "ks-moss"  # Replace with your GitHub username
password = "Moss_ks21"  # Replace with your GitHub password

# Directory where the database files are located
database_directory = "database/"

# List of database file names
db_files = ["user_data.db", "user_credentials.db", "password_key.db"]

try:
    # Create a GitHub instance with username and password
    github = Github(username, password)

    # Get the repository without lazy loading
    repo = github.get_repo(f"{repository_owner}/{repository_name}", lazy=False)

    # Commit and push the database files
    branch = repo.get_branch("main")  # Use the appropriate branch name

    for db_file in db_files:
        # Construct the full path to the database file
        db_file_path = os.path.join(database_directory, db_file)

        with open(db_file_path, "rb") as file:
            content = file.read()

        # Commit the file to the repository
        repo.create_file(db_file_path, f"Committing {db_file}", content, branch=branch)

    print("UPDATED!!!!!!!!!")

    # Now, you can access the data in 'user_data.db' and other database files
    # and perform the necessary operations.
except Exception as e:
    print(f"An error occurred: {e}")
