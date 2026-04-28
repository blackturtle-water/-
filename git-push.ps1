# Git Push Automation Agent for Windows PowerShell
param (
    [string]$Message = "Auto-update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

function Write-Step($msg) {
    Write-Host "`n>> $msg" -ForegroundColor Cyan
}

try {
    # 1. Git Identity Check
    $userEmail = git config user.email
    if ([string]::IsNullOrEmpty($userEmail)) {
        Write-Step "Setting default git identity..."
        git config user.email "user@example.com"
        git config user.name "blackturtle-water"
    }

    # 2. Add and Commit
    Write-Step "Adding changes..."
    git add .
    
    Write-Step "Committing changes with message: '$Message'..."
    $commitResult = git commit -m "$Message"
    if ($LASTEXITCODE -ne 0 -and $commitResult -notmatch "nothing to commit") {
        throw "Commit failed"
    }

    # 3. Pull with Rebase (Sync with Remote)
    Write-Step "Syncing with remote (Pull --rebase)..."
    git pull origin main --rebase
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Conflict detected! Please resolve conflicts manually, then run 'git rebase --continue' and push." -ForegroundColor Red
        exit 1
    }

    # 4. Push
    Write-Step "Pushing to remote..."
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        throw "Push failed"
    }

    Write-Host "`n[Success] Git Push Agent finished successfully!" -ForegroundColor Green
}
catch {
    Write-Host "`n[Error] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
