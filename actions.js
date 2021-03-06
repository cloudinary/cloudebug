export const ADD_ACTIVE_TAB = 'ADD_ACTIVE_TAB';
export const ADD_REQUEST = 'ADD_REQUEST';
export const SET_REQUEST_COMPLETE = 'SET_REQUEST_COMPLETE';
export const ADD_SCRAPED_DATA = 'ADD_SCRAPED_DATA';
export const RESET_TAB_DATA = "RESET_TAB_DATA";

const isCloudinaryByResponseHeader = (headers) => {
    let isCloudinary = false;
    
    headers.forEach((hd) => { 
        const headerName = hd.name.toLowerCase();
        const headerValue = hd.value.toLowerCase();
        
        if(headerName === "server" && headerValue === "cloudinary") {
            isCloudinary = true;
        }
    });

    return isCloudinary;
}

export const addTab = (tabId) => {
    return {
    type: ADD_ACTIVE_TAB,
    tabId: tabId || chrome.tabs.TAB_ID_NONE
    }
};

export const resetTab = (tabId) => {
	return {
		type: RESET_TAB_DATA,
		tabId,
	};
};

export const addRequest = (request, error = false) => {
    const { tabId = chrome.tabs.TAB_ID_NONE, requestId, url, timeStamp } = request;
    let tips = [];
    if (!url.includes('f_auto')) {
        tips.push('Image format selection - consider using automatic format selection f_auto')
    }
    if (!url.includes('q_auto')) {
        tips.push('Fixed quality used, consider replacing with automatic quality selection q_auto')
    }
    if (url.includes('f_gif') || url.includes('.gif')) {
        tips.push('Convert animated GIF to MP4')
    }
    if (url.includes('c_fill') && (!url.includes('g_auto') && !url.includes('g_face') && !url.includes('g_faces') )) {
        tips.push('Crop without content-aware gravity, consider using g_auto')
    }

    let warnings = []
    if (!url.includes('q_')) {
        warnings.push('Image quality not set, add q_auto')
    }
    
    
    return {
        type: ADD_REQUEST,
        tabId: tabId,
        request: {
            requestId,
            url,
            startTime: timeStamp,
            status: 'pending',
            tips,
            warnings,
            error
        }
    }
}
export const addScrapedData = (data, tabId) => {
    return {
        type: ADD_SCRAPED_DATA,
        tabId,
	    data
    }
}

export const setRequestComplete = (request) => {
    const { tabId = chrome.tabs.TAB_ID_NONE, timeStamp, requestId, responseHeaders } = request;
    
    return {
	    ...addRequest(request),
        type: SET_REQUEST_COMPLETE,
        tabId: tabId,
        requestId,
        timeStamp,
        isCloudinary: isCloudinaryByResponseHeader(responseHeaders)
    };
}