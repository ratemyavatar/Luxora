-- Luxora default full-avatar thumbnail, RCCService 2020.
local userId, baseUrl, fileExtension, x, y = ...
local ThumbnailGenerator = game:GetService("ThumbnailGenerator")
ThumbnailGenerator:AddProfilingCheckpoint("ThumbnailScriptStarted")
pcall(function() game:GetService("ContentProvider"):SetBaseUrl(baseUrl) end)
game:GetService("ScriptContext").ScriptsDisabled = true
game:GetService("UserInputService").MouseIconEnabled = false
local player = game:GetService("Players"):CreateLocalPlayer(userId)
player:LoadCharacterBlocking()
ThumbnailGenerator:AddProfilingCheckpoint("PlayerCharacterLoaded")
local result, requestedUrls = ThumbnailGenerator:Click(fileExtension, x, y, true)
ThumbnailGenerator:AddProfilingCheckpoint("ThumbnailGenerated")
return result, requestedUrls
