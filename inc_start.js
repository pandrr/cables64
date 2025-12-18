        function showError(initiator,...args)
        {
            CABLES.logErrorConsole("[" + initiator + "]", ...args);
        }

        function patchInitialized(patch)
        {
            // You can now access the patch object (patch), register variable watchers and so on
        }

        function patchFinishedLoading(patch)
        {
            // The patch is ready now, all assets have been loaded
        }

        // document.addEventListener("CABLES.jsLoaded", function (event)
        {
window.CABLES=CABLES;
window.Ops =Ops;

            const ele=document.createElement("canvas")
            ele.setAttribute("id","glcanvas")

            CABLES.patch = new CABLES.Patch({
                patch: CABLES.exportedPatch,
                "prefixAssetPath": "",
                "assetPath": "assets/",
                "jsPath": "js/",
                "glCanvasId": "glcanvas",
                "glCanvasResizeToWindow": true,
                "onError": showError,
                "onPatchLoaded": patchInitialized,
                "onFinishedLoading": patchFinishedLoading,
                "canvas": {"alpha":true, "premultipliedAlpha":true } // make canvas transparent
            });
        };
