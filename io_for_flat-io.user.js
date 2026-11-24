// ==UserScript==
// @name         [WIP] IO for Flat.io
// @namespace    https://github.com/the-can-of-soup
// @version      0.1.0
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
        // Keep trying to initialize until `flatData` exists.
        const flatData = window.flatEditorScoreData;
        if (!flatData) return;
        clearInterval(initInterval);

        const flatRt = flatData.rt;
        const flatAdagioData = flatData.adagioData;


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
            // This function imitates the internal function `flatRt._save`.

            // TODO <====================================================================================================================
            throw 'TODO'; // Todo: check if this works and reload tab after a successful save

            if (flatRt.saving || flatRt.savingHandler) throw 'A save is in progress.';
            if (await flatRt.isAwaitingSaveRevision()) throw 'The previous save has not received its revision information yet.';

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
                        override: false, // TODO: Maybe true? Analyze behavior of `override` in `flatRt._save`.
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

            } catch (err) {
                flatRt.saving = false;
                if (flatRt.unannouncedRevisionId === localRevId) {
                    flatRt.rejoinUnannouncedRevision();
                }

                throw err;
            }

            flatRt.saving = false;
            flatRt.runSavingHandler();
        }


        window.flatIoIO = {
            flatData,
            flatRt,
            flatAdagioData,

            exportScore,
            importScore,
        };


        console.log('[IO for Flat.io] Loaded; utilities are exposed at `flatIoIO`.');
    }

    console.log('[IO for Flat.io] Waiting for `flatEditorScoreData`...');
    const initInterval = setInterval(main, 1000);
})();
