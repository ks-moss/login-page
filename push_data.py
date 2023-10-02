import os
from github import Github

# GitHub repository information
repository_owner = "ks_moss"
repository_name = "login-page"
access_token = "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"

# Paths to the database files
db_files = ["user_data.db", "user_credentials.db", "password_key.db"]

# Create a GitHub instance
github = Github(access_token)

# Get the repository
repo = github.get_user(repository_owner).get_repo(repository_name)

# Commit and push the database files
branch = repo.get_branch("main")  # Use the appropriate branch name

for db_file in db_files:
    with open(db_file, "rb") as file:
        content = file.read()
    
    # Commit the file to the repository
    repo.create_file(db_file, f"Committing {db_file}", content, branch=branch)

# Now, you can retrieve the files when needed
# For example, to fetch the latest version of 'user_data.db':

latest_commit = repo.get_commits()[0]
tree = latest_commit.commit.tree

for db_file in db_files:
    if db_file in [item.path for item in tree]:
        # Download the file
        file_content = repo.get_contents(db_file, ref=branch)
        with open(db_file, "wb") as file:
            file.write(file_content.decoded_content)

print("UPDATED!!!!!!!!!")

# Now, you can access the data in 'user_data.db' and other database files
# and perform the necessary operations.
