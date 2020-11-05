var map = L.map('idmap', {

}).setView([52.237049, 21.017532], 10)

map.doubleClickZoom.disable();

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=SXOFB5ujKbDrlisGWCgm', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

//adding search control
var searchControl = L.esri.Geocoding.geosearch().addTo(map);
//addding layer groups to search control
var results = L.layerGroup().addTo(map);
searchControl.on('results', function(data) {
    results.clearLayers();

});

//a container that holds our sender receiver data pairs
const schedules = [];

function saveSchedule(sender, receiver, data) {
    //adds objects to schedules
    schedules.push({
        sender,
        receiver,
        data
    });

    //calls show schedule
    showSchedule(sender, receiver, data);
    //no need to call this we already add on the map click handler
}

function showSchedule(sender, receiver, data) {
    //adds receiver and sender markers to map
    const receiverMarker = L.marker(receiver)
    receiverMarker.addTo(map);

    const senderMarker = L.marker(sender)
    senderMarker.addTo(map);

    //adds a line between each two line
    const line = L.polyline([
        [sender.lat, sender.lng],
        [receiver.lat, receiver.lng]
    ]).addTo(map);
}


// Script for adding marker on map click
(function newScheduleFeature() {
    var sender = null;
    var receiver = null;
    var previewLine = null;
    let markerCounter = 0;

    //receiver marker on right click handler
    map.on('contextmenu', function(e) {
        geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
            if (error) {
                return;
            }

            if (receiver) {
                deleteReceiver();
            }


            receiver = L.marker(result.latlng, { draggable: true })
            receiver.addTo(map).on('drag', updatePreviewLineOnDrag).on('dragend', receiverDragEnd).on('click', deleteReceiver).on('add', putOnReceiverForm(result)).bindPopup("Receiver: " + result.address.Match_addr).openPopup();

            showPreviewLine();
        });
    });

    //sender marker on left click marker
    map.on('click', function onMapClick(e) {
        geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
            if (error) {
                return;
            }

            if (sender) {
                deleteSender(sender);
            }

            sender = L.marker(result.latlng, { draggable: true });
            sender.addTo(map).on('drag', updatePreviewLineOnDrag).on('dragend', senderDragEnd).on('click', deleteSender).on('add', putOnSenderForm(result)).bindPopup("Sender: " + result.address.Match_addr).openPopup();

            showPreviewLine();
        });
    });


    var geocodeService = L.esri.Geocoding.geocodeService();

    function senderDragEnd(e) {
        geocodeService.reverse().latlng(e.target._latlng).run(function(error, result) {
            if (error)
                return;

            putOnSenderForm(result);
        })

        map.removeLayer(previewLine);
        showPreviewLine();
    }

    function updatePreviewLineOnDrag() {
        map.removeLayer(previewLine);
        showPreviewLine();
    }


    function receiverDragEnd(e) {
        geocodeService.reverse().latlng(e.target._latlng).run(function(error, result) {
            if (error)
                return;

            putOnReceiverForm(result);
        })

        map.removeLayer(previewLine);
        showPreviewLine();
    }


    function putOnSenderForm(result) {
        document.getElementById('sender-street').value = result.address.Address.substring(0, result.address.Address.lastIndexOf(' '));
        document.getElementById('sender-city').value = result.address.City;
        document.getElementById('sender-zip').value = result.address.Postal;
        document.getElementById('sender-state').value = result.address.Region;
        document.getElementById('sender-building').value = result.address.AddNum;
        document.getElementById('sender-country').value = result.address.CountryCode;
    }

    function putOnReceiverForm(result) {
        document.getElementById('receiver-street').value = result.address.Address.substring(0, result.address.Address.lastIndexOf(' '));
        document.getElementById('receiver-city').value = result.address.City;
        document.getElementById('receiver-zip').value = result.address.Postal;
        document.getElementById('receiver-state').value = result.address.Region;
        document.getElementById('receiver-building').value = result.address.AddNum;
        document.getElementById('receiver-country').value = result.address.CountryCode;
    }

    window.onload = function() {
        document.getElementById('form').reset();
    }

    function showPreviewLine() {
        if (sender && receiver) previewLine = L.polyline([
            [sender.getLatLng().lat, sender.getLatLng().lng],
            [receiver.getLatLng().lat, receiver.getLatLng().lng]
        ]).addTo(map);
    }

    // Function to handle delete as well as other events on marker popup open

    function deleteSender() {
        if (sender) map.removeLayer(sender);
        if (previewLine) map.removeLayer(previewLine);

        sender = null;
        previewLine = null
    }


    function deleteReceiver() {
        if (receiver) map.removeLayer(receiver);
        if (previewLine) map.removeLayer(previewLine);

        receiver = null;
        previewLine = null;
    }

    //get form change
    // document.getElementById('form').addEventListener('change', () => {
    //     const addresses = {}
    //     var formData = new FormData(document.querySelector('form'))
    //     formData.forEach(function(value, key) {

    //         addresses[key] = value;
    //     });
    //     updateMarker(addresses);
    // })





    document.getElementById('form').addEventListener('submit', (e) => {
        const data = {};
        const formData = new FormData(document.getElementById('form'));
        formData.forEach(function(value, key) {
            data[key] = value;
        });

        saveSchedule(sender.getLatLng(), receiver.getLatLng(), data);

        deleteSender();
        deleteReceiver();
        //drawSchedules();

        console.log(schedules);

        e.preventDefault();
        return false;
    });
})();