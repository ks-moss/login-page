from github import Github
import os

# GitHub repository information
repository_owner = "ks_moss"
repository_name = "login-page"
access_token = "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"

# Directory where the database files are located
database_directory = "database/"

# List of database file names
db_files = ["user_data.db", "user_credentials.db", "password_key.db"]

# Create a GitHub instance using the access token
g = Github(access_token)

# Get the specified repository
repo = g.get_user(repository_owner).get_repo(repository_name)

print("REPO: ", repo)

# Iterate through the database files and push them to the repository
for db_file in db_files:
    file_path = os.path.join(database_directory, db_file)
    with open(file_path, 'rb') as file:
        content = file.read()
    try:
        # Create or update the file in the repository
        repo.create_file(
            path=file_path,
            message=f"Update {db_file}",
            content=content,
            branch="main"  # Change this branch name if necessary
        )
        print(f"{db_file} has been successfully pushed to the repository.")
    except Exception as e:
        print(f"Error occurred while pushing {db_file}: {str(e)}")
