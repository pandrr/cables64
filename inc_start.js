function showError(initiator,...args)
{
  CABLES.logErrorConsole("[" + initiator + "]", ...args);
}

CABLES.patch = new CABLES.Patch({
    patch: CABLES.exportedPatch,
    "prefixAssetPath": "",
    "assetPath": "assets/",
    "jsPath": "js/",
    "glCanvasResizeToWindow": true,
    "onError": showError,
});
