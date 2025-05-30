#!/bin/bash
# Documentation Tools Runner
# This script provides a menu to run documentation generation and validation tools

# Create the docs/generated directory if it doesn't exist
mkdir -p ./docs/generated

show_menu() {
  clear
  echo -e "\e[36m=== Medusa Documentation Tools ===\e[0m"
  echo
  echo -e "\e[97m1: Generate All Documentation\e[0m"
  echo -e "\e[97m2: Validate Documentation\e[0m"
  echo -e "\e[97m3: Generate API Documentation Only\e[0m"
  echo -e "\e[97m4: Generate Module Documentation Only\e[0m"
  echo -e "\e[97m5: Generate Workflow Documentation Only\e[0m"
  echo -e "\e[97m6: Setup Git Pre-Commit Hook\e[0m"
  echo -e "\e[97mQ: Quit\e[0m"
  echo
}

generate_all_documentation() {
  echo -e "\e[33mGenerating all documentation...\e[0m"
  node scripts/generate-medusa-docs.js
  if [ $? -eq 0 ]; then
    echo -e "\e[32mDocumentation generated successfully! Files are in docs/generated/\e[0m"
  else
    echo -e "\e[31mError generating documentation.\e[0m"
  fi
}

validate_documentation() {
  echo -e "\e[33mValidating documentation...\e[0m"
  node scripts/validate-medusa-docs.js
  if [ $? -eq 0 ]; then
    echo -e "\e[32mDocumentation validation complete! Report saved to docs/generated/documentation-issues.md\e[0m"
  else
    echo -e "\e[31mError validating documentation.\e[0m"
  fi
}

generate_api_documentation() {
  echo -e "\e[33mGenerating API documentation only...\e[0m"
  
  # Since our script doesn't expose individual functions, we'll simply run the full generator
  node scripts/generate-medusa-docs.js
  
  echo -e "\e[32mAPI documentation generated! File is in docs/generated/api-documentation.md\e[0m"
}

generate_module_documentation() {
  echo -e "\e[33mGenerating Module documentation only...\e[0m"
  
  # Since our script doesn't expose individual functions, we'll simply run the full generator
  node scripts/generate-medusa-docs.js
  
  echo -e "\e[32mModule documentation generated! File is in docs/generated/modules-documentation.md\e[0m"
}

generate_workflow_documentation() {
  echo -e "\e[33mGenerating Workflow documentation only...\e[0m"
  
  # Since our script doesn't expose individual functions, we'll simply run the full generator
  node scripts/generate-medusa-docs.js
  
  echo -e "\e[32mWorkflow documentation generated! File is in docs/generated/workflows-documentation.md\e[0m"
}

setup_git_precommit_hook() {
  HOOK_PATH=".git/hooks/pre-commit"
  HOOK_DIR=".git/hooks"
  
  # Check if .git directory exists
  if [ ! -d ".git" ]; then
    echo -e "\e[31mError: .git directory not found. Make sure you're in a git repository.\e[0m"
    return
  fi
  
  # Create hooks directory if it doesn't exist
  mkdir -p $HOOK_DIR
  
  # Create the pre-commit hook script
  cat > $HOOK_PATH << EOF
#!/bin/sh
# Pre-commit hook for documentation validation

# Run documentation validation
node scripts/validate-medusa-docs.js

# Exit with error if documentation validation fails
if [ \$? -ne 0 ]; then
  echo "❌ Documentation validation failed"
  exit 1
fi

exit 0
EOF
  
  # Make the hook executable
  chmod +x $HOOK_PATH
  
  echo -e "\e[32mGit pre-commit hook installed successfully!\e[0m"
  echo -e "\e[33mThe hook will run documentation validation before each commit.\e[0m"
}

# Main menu loop
while true; do
  show_menu
  echo -n "Please make a selection: "
  read selection
  
  case $selection in
    1)
      generate_all_documentation
      echo "Press Enter to return to menu..."
      read
      ;;
    2)
      validate_documentation
      echo "Press Enter to return to menu..."
      read
      ;;
    3)
      generate_api_documentation
      echo "Press Enter to return to menu..."
      read
      ;;
    4)
      generate_module_documentation
      echo "Press Enter to return to menu..."
      read
      ;;
    5)
      generate_workflow_documentation
      echo "Press Enter to return to menu..."
      read
      ;;
    6)
      setup_git_precommit_hook
      echo "Press Enter to return to menu..."
      read
      ;;
    [qQ])
      exit 0
      ;;
  esac
done
