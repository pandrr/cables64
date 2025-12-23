        function showError(initiator,...args)
        {
            CABLES.logErrorConsole("[" + initiator + "]", ...args);
        }

        function patchInitialized(patch)
        {
        }

        function patchFinishedLoading(patch)
        {
        }

window.CABLES=CABLES;
window.Ops =Ops;

            const ele=document.createElement("div")
            ele.setAttribute("id","cablescanvas");
            ele.style.width="100%"
            ele.style.height="100%"
            document.body.appendChild(ele);
            document.body.style.margin="0px";

            CABLES.patch = new CABLES.Patch({
                patch: CABLES.exportedPatch,
                "prefixAssetPath": "",
                "assetPath": "assets/",
                "jsPath": "js/",
                "glCanvasResizeToWindow": true,
                "onError": showError,
                "onPatchLoaded": patchInitialized,
                "onFinishedLoading": patchFinishedLoading
            });
