from github import Github
import os

# GitHub repository information
repository_owner = "ks-moss"
repository_name = "login-page"
access_token = "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"

# Directory where the database files are located
database_directory = ""

# List of database file names
db_files = ["user_data.db", "user_credentials.db", "password_key.db"]

# Create a GitHub instance using the access token
g = Github(access_token)

# Get the specified repository
repo = g.get_repo(f"{repository_owner}/{repository_name}")
    

# Iterate through the database files and push them to the repository
for db_file in db_files:
    file_path = os.path.join(database_directory, db_file)
    with open(file_path, 'rb') as file:
        content = file.read()
    
    try:
        # Get the current file contents to obtain the SHA hash
        current_file = repo.get_contents(db_file, ref="main")
        current_sha = current_file.sha

        # Create or update the file in the repository, providing the SHA hash
        repo.update_file(
            path=db_file,
            message=f"Update {db_file}",
            content=content,
            sha=current_sha,
            branch="main"  # Change this branch name if necessary
        )
        print(f"{db_file} has been successfully pushed to the repository.")
    except Exception as e:
        print(f"Error occurred while pushing {db_file}: {str(e)}")
