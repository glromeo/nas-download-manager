import {getMutableStateSingleton} from "./backgroundState";
import {notify} from "../common/notify";

import {addDownloadTasksAndPoll} from "./actions";
import {ALL_DOWNLOADABLE_PROTOCOLS, startsWithAnyProtocol} from "../common/apis/protocols";

export function initializeContextMenus() {
    browser.contextMenus.create({
        id: "add-to-nas",
        enabled: true,
        title: browser.i18n.getMessage("Download_with_DownloadStation"),
        contexts: ["link", "audio", "video", "image", "selection"]
    });

    browser.contextMenus.onClicked.addListener((data) => {
        if (data.menuItemId === "add-to-nas") {
            const state = getMutableStateSingleton();
            if (data.linkUrl) {
                addDownloadTasksAndPoll(
                    state.api,
                    state.pollRequestManager,
                    state.showNonErrorNotifications,
                    [data.linkUrl],
                );
            } else if (data.srcUrl) {
                addDownloadTasksAndPoll(
                    state.api,
                    state.pollRequestManager,
                    state.showNonErrorNotifications,
                    [data.srcUrl],
                );
            } else if (data.selectionText) {
                let urls = data.selectionText
                    .split("\n")
                    .map((url) => url.trim())
                    // The cheapest of checks. Actual invalid URLs will be caught later.
                    .filter((url) => startsWithAnyProtocol(url, ALL_DOWNLOADABLE_PROTOCOLS));

                if (urls.length == 0) {
                    notify(
                        browser.i18n.getMessage("Failed_to_add_download"),
                        browser.i18n.getMessage("Selected_text_is_not_a_valid_URL"),
                        "failure",
                    );
                } else {
                    addDownloadTasksAndPoll(
                        state.api,
                        state.pollRequestManager,
                        state.showNonErrorNotifications,
                        urls,
                    );
                }
            } else {
                notify(
                    browser.i18n.getMessage("Failed_to_add_download"),
                    browser.i18n.getMessage("URL_is_empty_or_missing"),
                    "failure",
                );
            }
        }
    });
}
