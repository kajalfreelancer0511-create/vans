# Simple native PowerShell HTTP Server for Vanshika Bansal Portfolio
$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Output "Web server started. Access it at http://localhost:$port/"
    
    # Open the browser automatically
    Start-Process "http://localhost:$port/"
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        # Build local file path
        $filePath = Join-Path "C:\Users\bansa\.gemini\antigravity\scratch\vanshika-bansal-portfolio" $urlPath.Substring(1)
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Set correct MIME types
            if ($urlPath.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($urlPath.EndsWith(".css")) { $response.ContentType = "text/css" }
            elseif ($urlPath.EndsWith(".js")) { $response.ContentType = "application/javascript" }
            elseif ($urlPath.EndsWith(".jpg") -or $urlPath.EndsWith(".jpeg")) { $response.ContentType = "image/jpeg" }
            elseif ($urlPath.EndsWith(".png")) { $response.ContentType = "image/png" }
            elseif ($urlPath.EndsWith(".svg")) { $response.ContentType = "image/svg+xml" }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errorMessage = "404 - File Not Found"
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    }
} catch {
    Write-Error $_
} finally {
    $listener.Close()
}
