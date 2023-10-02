import os
from github import Github

# GitHub repository information
repository_owner = "ks_moss"
repository_name = "login-page"
access_token = "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"

# Directory where the database files are located
database_directory = "database/"

# List of database file names
db_files = ["user_data.db", "user_credentials.db", "password_key.db"]

# Create a GitHub instance
github = Github(access_token)

# Get the repository
repo = github.get_user(repository_owner).get_repo(repository_name)

# Commit and push the database files
branch = repo.get_branch("main")  # Use the appropriate branch name

print("HERE!!!!!!!!!")

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
