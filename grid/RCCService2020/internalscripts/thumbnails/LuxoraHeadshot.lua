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
    -- 2020 portrait framing: include the head, shoulders, and upper torso rather
    -- than filling the circle with only the face. Rendering large then scaling
    -- down also prevents the dark one-pixel edge seen on tiny navbar renders.
    local look = head.CFrame * CFrame.new(0, -0.7, 0)
    local position = head.CFrame + (CFrame.Angles(0, -math.pi / 16, 0).lookVector.unit * 5.25)
    camera.CoordinateFrame = CFrame.new(position.p, look.p)
    camera.FieldOfView = 38
    workspace.CurrentCamera = camera
end
local result, requestedUrls = ThumbnailGenerator:Click(fileExtension, x, y, true)
ThumbnailGenerator:AddProfilingCheckpoint("ThumbnailGenerated")
return result, requestedUrls
