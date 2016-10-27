/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        $('download').addEventListener('click', startPauseResumeDownload);
        $('abort').addEventListener('click', reloadAll)
    }
};

function startPauseResumeDownload() {
    console.log("isStart", this.isStart);
    if (!this.isStart) {
        this.isStart = true;
        b = $('download')
        b.setAttribute('class', b.getAttribute('class').replace('btn-primary', ''))
        b.setAttribute('disabled', 'true')
    }

    //var fileTransfer = new FileTransfer();
    var fileTransfer = new PRD(); // Use PRD ( extended cordova-plugin-pause-resume-download )

    var uri = encodeURI($('url').innerHTML);
    var fileURL = cordova.file.dataDirectory + "/qq.exe";

    fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
            console.log("download complete: " + entry.toURL());
            updateProgress(100);
        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
        },
        false, {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );

    fileTransfer.onprogress = function(progress) {
        if (this.pre === undefined) this.pre = 0;

        var now = ~~((progress.loaded / progress.total) * 100 * 100);
        if (now - +this.pre > 17) {
            updateProgress(now / 100);
            this.pre = now;
        }
    }
}

function reloadAll() {
    window.location.reload();
}

function updateProgress(data) {
    if (this.progress === undefined) this.progress = $('progress'); //store progress
    this.progress.setAttribute('style', 'width: ' + data + '%');
    this.progress.innerHTML = data + "%";
}

$ = function(id) {
    return document.getElementById(id);
}

app.initialize();