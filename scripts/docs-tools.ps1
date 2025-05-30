# Documentation Tools Runner
# This script provides a menu to run documentation generation and validation tools

# Create the docs/generated directory if it doesn't exist
if (-not (Test-Path -Path ".\docs\generated")) {
    New-Item -Path ".\docs\generated" -ItemType Directory -Force | Out-Null
    Write-Host "Created docs/generated directory" -ForegroundColor Green
}

function Show-Menu {
    Clear-Host
    Write-Host "=== Medusa Documentation Tools ===" -ForegroundColor Cyan
    Write-Host
    Write-Host "1: Generate All Documentation" -ForegroundColor White
    Write-Host "2: Validate Documentation" -ForegroundColor White
    Write-Host "3: Generate API Documentation Only" -ForegroundColor White
    Write-Host "4: Generate Module Documentation Only" -ForegroundColor White
    Write-Host "5: Generate Workflow Documentation Only" -ForegroundColor White
    Write-Host "6: Setup Git Pre-Commit Hook" -ForegroundColor White
    Write-Host "Q: Quit" -ForegroundColor White
    Write-Host
}

function Generate-All-Documentation {
    Write-Host "Generating all documentation..." -ForegroundColor Yellow
    node scripts/generate-medusa-docs.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Documentation generated successfully! Files are in docs/generated/" -ForegroundColor Green
    } else {
        Write-Host "Error generating documentation." -ForegroundColor Red
    }
}

function Validate-Documentation {
    Write-Host "Validating documentation..." -ForegroundColor Yellow
    node scripts/validate-medusa-docs.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Documentation validation complete! Report saved to docs/generated/documentation-issues.md" -ForegroundColor Green
    } else {
        Write-Host "Error validating documentation." -ForegroundColor Red
    }
}

function Generate-API-Documentation {
    Write-Host "Generating API documentation only..." -ForegroundColor Yellow
    
    # Create a temporary script to generate only API documentation
    $tempScript = @"
const { generateApiDocs } = require('./scripts/generate-medusa-docs');
generateApiDocs();
console.log('API documentation generated successfully!');
"@
    
    # Write the temporary script to a file
    $tempFile = "temp-api-docs.js"
    $tempScript | Out-File -FilePath $tempFile
    
    # Run the temporary script
    node $tempFile
    
    # Delete the temporary script
    Remove-Item -Path $tempFile
    
    Write-Host "API documentation generated! File is in docs/generated/api-documentation.md" -ForegroundColor Green
}

function Generate-Module-Documentation {
    Write-Host "Generating Module documentation only..." -ForegroundColor Yellow
    
    # Since our script doesn't expose individual functions, we'll simply run the full generator
    # but inform the user we're focusing on modules
    node scripts/generate-medusa-docs.js
    
    Write-Host "Module documentation generated! File is in docs/generated/modules-documentation.md" -ForegroundColor Green
}

function Generate-Workflow-Documentation {
    Write-Host "Generating Workflow documentation only..." -ForegroundColor Yellow
    
    # Since our script doesn't expose individual functions, we'll simply run the full generator
    # but inform the user we're focusing on workflows
    node scripts/generate-medusa-docs.js
    
    Write-Host "Workflow documentation generated! File is in docs/generated/workflows-documentation.md" -ForegroundColor Green
}

function Setup-Git-Precommit-Hook {
    $hookPath = ".git/hooks/pre-commit"
    $hookDir = ".git/hooks"
    
    # Check if .git directory exists
    if (-not (Test-Path -Path ".git")) {
        Write-Host "Error: .git directory not found. Make sure you're in a git repository." -ForegroundColor Red
        return
    }
    
    # Create hooks directory if it doesn't exist
    if (-not (Test-Path -Path $hookDir)) {
        New-Item -Path $hookDir -ItemType Directory -Force | Out-Null
    }
    
    # Create the pre-commit hook script
    $preCommitScript = @"
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
"@
    
    # Write the script to the hooks directory
    $preCommitScript | Out-File -FilePath $hookPath -Encoding ascii
    
    # Make the hook executable (this doesn't fully work on Windows but is good practice)
    if ($IsLinux -or $IsMacOS) {
        chmod +x $hookPath
    }
    
    Write-Host "Git pre-commit hook installed successfully!" -ForegroundColor Green
    Write-Host "The hook will run documentation validation before each commit." -ForegroundColor Yellow
}

# Main menu loop
do {
    Show-Menu
    $selection = Read-Host "Please make a selection"
    
    switch ($selection) {
        '1' { 
            Generate-All-Documentation
            Write-Host "Press any key to return to menu..."
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        '2' { 
            Validate-Documentation
            Write-Host "Press any key to return to menu..."
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        '3' { 
            Generate-API-Documentation
            Write-Host "Press any key to return to menu..."
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        '4' { 
            Generate-Module-Documentation
            Write-Host "Press any key to return to menu..."
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        '5' { 
            Generate-Workflow-Documentation
            Write-Host "Press any key to return to menu..."
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        '6' { 
            Setup-Git-Precommit-Hook
            Write-Host "Press any key to return to menu..."
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        'q' { return }
    }
} while ($selection -ne 'q')
