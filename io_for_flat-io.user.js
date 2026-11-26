// ==UserScript==
// @name         IO for Flat.io
// @namespace    https://github.com/the-can-of-soup
// @version      1.0.3
// @description  Adds the ability to import/export Flat.io scores to a file for local storage or manipulation.
// @author       the-can-of-soup
// @match        https://flat.io/score/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flat.io
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        // Keep trying to initialize until `flatData`, `header`, and `shareButton` exist.

        const flatData = window.flatEditorScoreData;
        const header = document.querySelector('.ScoreEditorHeader_lAyJx');
        const shareButton = document.querySelector('.ScoreEditorShareButton_Gb8lA');

        if (!flatData || !header || !shareButton) return;
        clearInterval(initInterval);


        const flatRt = flatData.rt;
        const flatAdagioData = flatData.adagioData;

        const exportButtonSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="17.37251" height="17.36286" viewBox="0,0,17.37251,17.36286"><g transform="translate(-231.31375,-171.31857)"><g fill="none" stroke-width="1.5" stroke-linecap="round" stroke-miterlimit="10" stroke="currentcolor"><g stroke-linejoin="round"><path d="M240.00002,172.06857v12.50913l-3.80249,-3.80249" style="fill: none;"></path><path d="M243.8025,180.77521l-3.80249,3.8025v-12.50914" style="fill: none;"></path></g><g stroke-linejoin="miter"><path d="M232.06376,187.93143v-6.68754" style="fill: none;"></path><path d="M247.93627,181.24389v6.68754" style="fill: none;"></path><path d="M247.93627,187.93143h-15.87251" style="fill: none;"></path></g></g></g></svg>\n<!--rotationCenter:8.686245000000014:8.681430000000006-->';
        const importButtonSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="17.37251" height="17.36286" viewBox="0,0,17.37251,17.36286"><g transform="translate(-231.31376,-171.31857)"><g fill="none" stroke-width="1.5" stroke-linecap="round" stroke-miterlimit="10" stroke="currentcolor"><g stroke-linejoin="round"><path d="M236.19754,175.87107l3.80249,-3.80249v12.50913" style="fill: none;"/><path d="M240.00002,184.57771v-12.50914l3.80249,3.8025" style="fill: none;"/></g><g stroke-linejoin="miter"><path d="M232.06377,187.93143v-6.68754" style="fill: none;"/><path d="M247.93628,187.93143v-6.68754" style="fill: none;"/><path d="M247.93628,187.93143h-15.87251" style="fill: none;"/></g></g></g></svg>\n<!--rotationCenter:8.68623500000001:8.681430000000006-->';
        const exportButtonSvgUri = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNy4zNzI1MSIgaGVpZ2h0PSIxNy4zNjI4NiIgdmlld0JveD0iMCwwLDE3LjM3MjUxLDE3LjM2Mjg2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMxLjMxMzc1LC0xNzEuMzE4NTcpIj48ZyBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZT0iY3VycmVudGNvbG9yIj48ZyBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjQwLjAwMDAyLDE3Mi4wNjg1N3YxMi41MDkxM2wtMy44MDI0OSwtMy44MDI0OSIgc3R5bGU9ImZpbGw6IG5vbmU7Ij48L3BhdGg+PHBhdGggZD0iTTI0My44MDI1LDE4MC43NzUyMWwtMy44MDI0OSwzLjgwMjV2LTEyLjUwOTE0IiBzdHlsZT0iZmlsbDogbm9uZTsiPjwvcGF0aD48L2c+PGcgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PHBhdGggZD0iTTIzMi4wNjM3NiwxODcuOTMxNDN2LTYuNjg3NTQiIHN0eWxlPSJmaWxsOiBub25lOyI+PC9wYXRoPjxwYXRoIGQ9Ik0yNDcuOTM2MjcsMTgxLjI0Mzg5djYuNjg3NTQiIHN0eWxlPSJmaWxsOiBub25lOyI+PC9wYXRoPjxwYXRoIGQ9Ik0yNDcuOTM2MjcsMTg3LjkzMTQzaC0xNS44NzI1MSIgc3R5bGU9ImZpbGw6IG5vbmU7Ij48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+CjwhLS1yb3RhdGlvbkNlbnRlcjo4LjY4NjI0NTAwMDAwMDAxNDo4LjY4MTQzMDAwMDAwMDAwNi0tPg==';
        const importButtonSvgUri = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNy4zNzI1MSIgaGVpZ2h0PSIxNy4zNjI4NiIgdmlld0JveD0iMCwwLDE3LjM3MjUxLDE3LjM2Mjg2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMxLjMxMzc2LC0xNzEuMzE4NTcpIj48ZyBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZT0iY3VycmVudGNvbG9yIj48ZyBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjM2LjE5NzU0LDE3NS44NzEwN2wzLjgwMjQ5LC0zLjgwMjQ5djEyLjUwOTEzIiBzdHlsZT0iZmlsbDogbm9uZTsiLz48cGF0aCBkPSJNMjQwLjAwMDAyLDE4NC41Nzc3MXYtMTIuNTA5MTRsMy44MDI0OSwzLjgwMjUiIHN0eWxlPSJmaWxsOiBub25lOyIvPjwvZz48ZyBzdHJva2UtbGluZWpvaW49Im1pdGVyIj48cGF0aCBkPSJNMjMyLjA2Mzc3LDE4Ny45MzE0M3YtNi42ODc1NCIgc3R5bGU9ImZpbGw6IG5vbmU7Ii8+PHBhdGggZD0iTTI0Ny45MzYyOCwxODcuOTMxNDN2LTYuNjg3NTQiIHN0eWxlPSJmaWxsOiBub25lOyIvPjxwYXRoIGQ9Ik0yNDcuOTM2MjgsMTg3LjkzMTQzaC0xNS44NzI1MSIgc3R5bGU9ImZpbGw6IG5vbmU7Ii8+PC9nPjwvZz48L2c+PC9zdmc+CjwhLS1yb3RhdGlvbkNlbnRlcjo4LjY4NjIzNTAwMDAwMDAxOjguNjgxNDMwMDAwMDAwMDA2LS0+';

        const filenameUnsafeChars = '/\\*.!~&><$:"|';


        function exportScore() {
            // Sync: Export the score as an object that may be encoded with JSON.

            // `flatData.getRevisionId()` is equivalent to `flatData.revisionId`
            const {scoreId, revisionId, revisionDate} = flatData;
            const data = flatAdagioData.exportData(); // Old async version: await flatData.getRevision(revisionId)

            return {
                _: 'Exported with Soup\'s "IO for Flat.io" userscript. GitHub: https://github.com/the-can-of-soup/io_for_flat-io',
                formatVersion: 0,
                exportTimeMs: Date.now(),
                scoreId,
                revisionId,
                revisionTimeMs: revisionDate.getTime(),
                data,
            };
        }

        async function importScore(exportedData) {
            // Async: Import a score that was exported with `exportScore` and save it to the cloud immediately.
            // Will NOT use the save queue; return false if importing immediately is impossible.
            //
            // This function imitates the internal function `flatRt._save`.

            if (flatRt.saving || flatRt.savingHandler) return false; // throw 'A save is in progress.';
            if (await flatRt.isAwaitingSaveRevision()) return false; // throw 'The previous save has not received its revision information yet.';

            flatRt.saving = true;
            const localRevId = flatRt.localRevisionId;

            try {
                const ackGroups = await flatRt.getAckGroups();
                flatRt.emit('save');

                await flatData.saveNewRevision(
                    exportedData.data,
                    ackGroups.map((ackGroup) => {
                        if (ackGroup === null) return null;
                        let {
                            actions,
                            revertHistory,
                            logs,
                        } = ackGroup;
                        const {
                            parentId,
                            groupId,
                            type,
                            hash,
                            userId,
                            scoreId,
                            revisionId,
                        } = ackGroup;

                        actions = actions ? actions.slice() : [];
                        revertHistory = revertHistory ? revertHistory.slice() : [];
                        logs = logs ? logs.slice() : [];

                        return {
                            parentId,
                            hash,
                            type,
                            actions,
                            groupId,
                            userId,
                            logs,
                            scoreId,
                            revisionId,
                            revertHistory,
                        };
                    }),
                    {
                        autosave: false,
                        context: 'deviceManualSave',
                        override: false, // I do not know in which cases this should be true; it is passed directly to the server.
                        parentRevisionId: localRevId,
                        deviceId: flatRt.deviceId,
                        deviceType: flatRt.deviceType,
                        instanceId: flatRt.instanceId,
                    },
                );

                if (ackGroups.length > 0) {
                    flatRt.awaitSaveRevision(ackGroups[ackGroups.length - 1].groupId);
                }

                flatRt.emit('saveDone');
                flatRt.emit('completeRedraw'); // This line is not in `flatRt._save`; often this is emitted automatically, but it seems to be unpredictable

            } catch (err) {
                flatRt.saving = false;
                if (flatRt.unannouncedRevisionId === localRevId) {
                    flatRt.rejoinUnannouncedRevision();
                }

                throw err;
            }

            flatRt.saving = false;
            flatRt.runSavingHandler();

            return true;
        }

        /*
        The save queue does not appear to work? This function is basically just the same as `importScore`.

        function queuedImportScore(exportedData) {
            // Async: Import a score that was exported with `exportScore` and save it to the cloud immediately
            // after. Will use the save queue; import will not occur until no other saves are in progress. To
            // ignore the save queue, use `importScore` instead.
            //
            // This function partially imitates the internal function `flatRt.save`.
            //
            // - Return once the import is completed.

            return new Promise((resolve, reject) => {
                const resolveAndReturn = (value) => { resolve(value); return value; };
                const rejectAndThrow = (reason) => { reject(reason); throw reason; };

                flatRt.saveQueue.add(
                    () => importScoreImmediately(exportedData).then(resolveAndReturn, rejectAndThrow)
                );
            });
        }
        */

        function base64EncodeUnicode(text) {
            // Stolen from my Desmos import/export userscript found here:
            // https://github.com/the-can-of-soup/desmos_import_export

            return btoa(
                Array.from(new TextEncoder().encode(text))
                    .map(byte => String.fromCodePoint(byte))
                    .join('')
            );
        }

        function downloadText(text, filename, mimeType = 'text/plain') {
            // Also stolen from my Desmos import/export userscript

            const link = document.createElement('a');
            link.href = `data:${mimeType};base64,${base64EncodeUnicode(text)}`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

        function filenameSafeify(text) {
            // Return a filename-safe version of `text`.

            let safe = '';
            let length = 0;
            for (let char of text) {
                if (length >= 128) break;
                safe += filenameUnsafeChars.includes(char) ? '-' : char;
                length += 1;
            }

            if (safe.length === 0) return '_';
            return safe;
        }

        function exportButtonClicked() {
            // Runs when the export button is clicked.

            let data;
            try {
                data = exportScore();
            } catch (err) {
                console.error(`[IO for Flat.io] Export error: ${err}`);
                alert(`Export error: ${err}`);
                return;
            }
            const scorePartwise = data.data['score-partwise'];

            // Get score title and authors
            const title = scorePartwise.work['work-title'];
            const authors = { composer: null, lyricist: null, arranger: null };
            for (let creatorItem of scorePartwise.identification.creator) {
                authors[creatorItem.$type] = creatorItem.content;
            }
            const authorsArr = [];
            if (authors.composer) authorsArr.push(authors.composer);
            if (authors.lyricist) authorsArr.push(authors.lyricist);
            if (authors.arranger) authorsArr.push(authors.arranger);

            // Create filename
            let filename = title;
            if (authorsArr.length > 0) {
                filename += ' - ';
                filename += authorsArr.join(', ');
            }
            filename = filenameSafeify(filename);
            filename += '.flatio';

            const dataText = JSON.stringify(data);
            downloadText(dataText, filename, 'application/json');
            console.log(`[IO for Flat.io] Exported as ${JSON.stringify(filename)}.`);
        }

        function importButtonClicked(fileInput) {
            // Sync: Runs when the import button is clicked.
            //
            // - `fileInput`: The hidden file input element.

            fileInput.accept = '.flatio';
            fileInput.click();
        }

        async function fileSelected(fileInput) {
            // Async: Runs when a file is selected from the system file chooser after clicking the import
            // button (or when the file chooser is closed).
            //
            // - `fileInput`: The hidden file input element.
            // - Return: True if imported successfully, else false.

            if (fileInput.files.length < 1) return; // No file selected
            const file = fileInput.files[0];
            const filenameJSON = JSON.stringify(file.name)

            // Read as text
            let text;
            try {
                text = await file.text();
            } catch (err) {
                console.warn(`[IO for Flat.io] Error decoding text for file ${filenameJSON}: ${err}`);
                alert(`Error decoding text: ${err}`);
                return false;
            }

            // Parse JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.warn(`[IO for Flat.io] Error parsing JSON for file ${filenameJSON}: ${err}`);
                alert(`JSON parse error: ${err}`);
                return false;
            }

            // Import score
            let imported;
            try {
                imported = await importScore(data);
            } catch (err) {
                console.error(`[IO for Flat.io] Import error for file ${filenameJSON}: ${err}`);
                alert(`Import error: ${err}`);
                return false;
            }

            if (!imported) {
                console.warn(`[IO for Flat.io] Couldn't import file ${filenameJSON} due to save in progress.`);
                alert(`Couldn't import because a save is already in progress. Please wait a moment.`);
                return false;
            }

            console.log(`[IO for Flat.io] Imported file ${filenameJSON}.`);
            return true;
        }

        function createExportButton() {
            // Return a new export button element.

            const button = document.createElement('div');
            button.classList.add('headerButton_SsOY4', 'helpButton_P_tE0');
            button.style.color = 'var(--text-accent-primary-default)';
            button.style.marginLeft = '0px';
            button.style.borderTopLeftRadius = '0px';
            button.style.borderBottomLeftRadius = '0px';
            button.style.borderLeft = '2px solid var(--text-accent-primary-default)';

            button.innerHTML = exportButtonSvg;

            button.onclick = exportButtonClicked;

            return button;
        }

        function createImportButton() {
            // Return a new import button element.

            const button = document.createElement('div');
            button.classList.add('headerButton_SsOY4', 'helpButton_P_tE0');
            button.style.color = 'var(--text-accent-primary-default)';
            button.style.borderTopRightRadius = '0px';
            button.style.borderBottomRightRadius = '0px';

            button.innerHTML = importButtonSvg;

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.hidden = true;
            button.append(fileInput);

            button.onclick = importButtonClicked.bind(this, fileInput);
            fileInput.addEventListener('change', fileSelected.bind(this, fileInput));

            return button;
        }


        // Inject buttons

        const headerRight = shareButton.parentElement;

        const exportButton = createExportButton();
        const importButton = createImportButton();
        headerRight.insertBefore(exportButton, shareButton);
        headerRight.insertBefore(importButton, exportButton);


        window.flatIoIO = {
            flatData,
            flatRt,
            flatAdagioData,

            exportButtonSvg,
            importButtonSvg,
            exportButtonSvgUri,
            importButtonSvgUri,

            filenameUnsafeChars,

            exportScore,
            importScore,
            // queuedImportScore,

            base64EncodeUnicode,
            downloadText,
            filenameSafeify,

            exportButtonClicked,
            importButtonClicked,
            fileSelected,

            createExportButton,
            createImportButton,

            header,
            headerRight,
            shareButton,
            exportButton,
            importButton,
        };


        console.log('[IO for Flat.io] Loaded; interfaces are exposed at `flatIoIO`.');
    }

    
    console.log('[IO for Flat.io] Waiting for `flatEditorScoreData` and header elements...');
    const initInterval = setInterval(main, 1000);
})();
