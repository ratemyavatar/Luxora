-- Luxora default avatar headshot, RCCService 2020.
local userId, baseUrl, fileExtension, x, y = ...
local ThumbnailGenerator = game:GetService("ThumbnailGenerator")
ThumbnailGenerator:AddProfilingCheckpoint("ThumbnailScriptStarted")
pcall(function() game:GetService("ContentProvider"):SetBaseUrl(baseUrl) end)
game:GetService("ScriptContext").ScriptsDisabled = true
game:GetService("UserInputService").MouseIconEnabled = false
local player = game:GetService("Players"):CreateLocalPlayer(userId)
player:LoadCharacterBlocking()
ThumbnailGenerator:AddProfilingCheckpoint("PlayerCharacterLoaded")
local character = player.Character
if character and character:FindFirstChild("Head") then
    local head = character.Head
    local camera = Instance.new("Camera", character)
    camera.Name = "ThumbnailCamera"
    camera.CameraType = Enum.CameraType.Scriptable
    local look = head.CFrame * CFrame.new(0, 0.15, 0)
    local position = head.CFrame + (CFrame.Angles(0, -math.pi / 16, 0).lookVector.unit * 3)
    camera.CoordinateFrame = CFrame.new(position.p, look.p)
    camera.FieldOfView = 30
    workspace.CurrentCamera = camera
end
local result, requestedUrls = ThumbnailGenerator:Click(fileExtension, x, y, true)
ThumbnailGenerator:AddProfilingCheckpoint("ThumbnailGenerated")
return result, requestedUrls
