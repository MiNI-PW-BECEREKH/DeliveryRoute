$(document).ready(function () {

    var markers = [];
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
    searchControl.on('results', function (data) {
        results.clearLayers();

    });

    //a container that holds our sender receiver data pairs
    //var schedules = [];

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
        map.on('contextmenu', function (e) {
            //for safety and no accidental edits
            document.getElementById('deliveryid').value = "";
            geocodeService.reverse().latlng(e.latlng).run(function (error, result) {
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
            //for safety and no accidental edits
            document.getElementById('deliveryid').value = "";
            geocodeService.reverse().latlng(e.latlng).run(function (error, result) {
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

        function senderDragEnd(e, id, data) {
            geocodeService.reverse().latlng(e.target._latlng).run(function (error, result) {
                if (error)
                    return;

                putOnSenderForm(result);

            })

            if (previewLine) {
                map.removeLayer(previewLine);
                showPreviewLine();
            }
            if (data)
                updateFormData(e, id, data);
            //GetDeliveries();
        }

        function updatePreviewLineOnDrag() {
            map.removeLayer(previewLine);
            showPreviewLine();
            //we need to find changed preview line and change it is position with marker
        }


        function receiverDragEnd(e, id, data) {
            geocodeService.reverse().latlng(e.target._latlng).run(function (error, result) {
                if (error)
                    return;

                putOnReceiverForm(result);
            })

            if (previewLine) {
                map.removeLayer(previewLine);
                showPreviewLine();
            }
            if (data)
                updateFormData(e, id, data);

            //GetDeliveries();
        }


        function putOnSenderForm(result) {
            document.getElementById('sender-street').value = result.address.Address.substring(0, result.address.Address.lastIndexOf(' '));
            document.getElementById('sender-city').value = result.address.City;
            document.getElementById('sender-zip').value = result.address.Postal;
            document.getElementById('sender-state').value = result.address.Region;
            document.getElementById('sender-building').value = result.address.AddNum;
            document.getElementById('sender-country').value = result.address.CountryCode;
            document.getElementById('sender-coordinate').value = result.latlng.lat + "," + result.latlng.lng;
            console.log(result);
            //GetDeliveries();
        }

        function putOnReceiverForm(result) {
            document.getElementById('receiver-street').value = result.address.Address.substring(0, result.address.Address.lastIndexOf(' '));
            document.getElementById('receiver-city').value = result.address.City;
            document.getElementById('receiver-zip').value = result.address.Postal;
            document.getElementById('receiver-state').value = result.address.Region;
            document.getElementById('receiver-building').value = result.address.AddNum;
            document.getElementById('receiver-country').value = result.address.CountryCode;
            document.getElementById('receiver-coordinate').value = result.latlng.lat + "," + result.latlng.lng;
            //GetDeliveries();
        }

        window.onload = function () {

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

        function removeDelivery(e, id, data) {
            if (e.originalEvent.ctrlKey) {

                $.ajax({
                    url: '/api/delivery/delete/' + id,
                    type: 'delete',
                    success: function () {
                        console.log("form deleted");
                        downloadData();
                    }
                });

            }
            else {
                updateFormData(e, id, data);
            }
        }

        function updateFormData(e, id, data) {
            data.forEach(element => {
                if (element.id === id) {
                    document.getElementById('deliveryid').value = element.id;
                    putOnEditReceiver(element.receiver);
                    putOnEditSender(element.sender);
                    putOnEditParcel(element.package);
                    //on button click check if id field exists
                    //if so send edit request on server
                }
            })
        }

        function putOnEditReceiver(receiver) {
            console.log(receiver);
            let address = receiver.address;
            document.getElementById('receiver-street').value = address.street;
            document.getElementById('receiver-city').value = address.city;
            document.getElementById('receiver-zip').value = address.zipCode;
            document.getElementById('receiver-state').value = address.state;
            document.getElementById('receiver-building').value = address.building;
            document.getElementById('receiver-country').value = address.country;
            document.getElementById('receiver-coordinate').value = address.coordinate;
            //then fill the info about receiver
            document.getElementById('receiver-fname').value = receiver.name;
            document.getElementById('receiver-sname').value = receiver.surname;
            document.getElementById('receiver-phone').value = receiver.phonenumber;
            document.getElementById('receiver-email').value = receiver.email;
        }


        function putOnEditSender(sender) {
            console.log(sender);
            let address = sender.address;
            document.getElementById('sender-street').value = address.street;
            document.getElementById('sender-city').value = address.city;
            document.getElementById('sender-zip').value = address.zipCode;
            document.getElementById('sender-state').value = address.state;
            document.getElementById('sender-building').value = address.building;
            document.getElementById('sender-country').value = address.country;
            document.getElementById('sender-coordinate').value = address.coordinate;


            document.getElementById('sender-fname').value = sender.name;
            document.getElementById('sender-sname').value = sender.surname;
            document.getElementById('sender-phone').value = sender.phonenumber;
            document.getElementById('sender-email').value = sender.email;

        }


        function putOnEditParcel(parcel) {
            console.log(parcel);
            switch (parcel.parceltype) {
                case "package":
                    document.getElementById('package').checked = true;
                    break;
                case "envelope":
                    document.getElementById('envelope').checked = true;
                    break;
                default:
                    break;
            }
            document.getElementById('width').value = parcel.width;
            document.getElementById('height').value = parcel.height;
            document.getElementById('length').value = parcel.length;
            document.getElementById('weight').value = parcel.weight;
            document.getElementById('comments').value = ((parcel.comments == null) ? "" : parcel.comments);
            document.getElementById('pickupdate').value = parcel.date.split('T')[0]
            document.getElementById('pickuptime').value = parcel.time.split('T')[1];
        }

        function downloadData() {
            $.getJSON("/api/delivery/get/", function (data) {
                markers.forEach(element => {
                    map.removeLayer(element);
                });

                displayData(data);
            });
        }

        let nline;
        function serverUpdatePreviewLineOnDrag(e, cs, cr, l) {

            markers.splice(markers.indexOf(l), 1);
            map.removeLayer(l)
            // window.map.removeLayer(line);
            if (nline)
                map.removeLayer(nline)
            nline = L.polyline([
                cs.getLatLng(),
                cr.getLatLng()
            ]).addTo(map);
            markers.push(nline);



        }

        function displayData(data) {
            data.forEach(element => {
                // let sq = "";
                // let rq = "";
                // Object.keys(element.sender.address).forEach(function (key) {
                //     sq += element.sender.address[key] + " ";
                // })

                // Object.keys(element.receiver.address).forEach(function (key) {
                //     rq += element.receiver.address[key] + " ";
                // })
                // geocodeService.geocode().text(sq).run(function (err, results) {
                //     if (err)
                //         return;
                //     console.log(sq);
                //     var s = L.marker(results.latlng);
                //     console.log(results.latlng);
                //     s.addTo(map); //add pop up with details
                // })
                // geocodeService.geocode().text(rq).run(function (err, results) {
                //     if (err)
                //         return;
                //     console.log(rq);

                //     var r = L.marker(results.latlng);
                //     r.addTo(map); //add pop up with details
                // })
                console.log(element.sender);
                let cs = element.sender.address.coordinate.split(",");
                let cr = element.receiver.address.coordinate.split(",");
                let s = L.marker([parseFloat(cs[0]), parseFloat(cs[1])], { draggable: true }).on('drag', function (e) { serverUpdatePreviewLineOnDrag(e, s, r, line) }).on('dragend', function (e) {
                    senderDragEnd(e, element.id, data);
                }).on('click', (e) => { removeDelivery(e, element.id, data) }).bindPopup("Sender:" + element.sender.name + " " + element.sender.surname + "," + element.sender.phonenumber + "," + element.sender.email).openPopup();
                s.addTo(map);


                let r = L.marker([parseFloat(cr[0]), parseFloat(cr[1])], { draggable: true }).on('drag', function (e) { serverUpdatePreviewLineOnDrag(e, s, r, line) }).on('dragend', function (e) {
                    receiverDragEnd(e, element.id, data);
                }).on('click', (e) => { removeDelivery(e, element.id, data) }).bindPopup("Receiver:" + element.receiver.name + " " + element.receiver.surname + "," + element.receiver.phonenumber + "," + element.receiver.email).openPopup();
                r.addTo(map);


                let line = L.polyline([
                    s.getLatLng(),
                    r.getLatLng()
                ]).addTo(map);

                markers.push(s);
                markers.push(r);
                markers.push(line);

            });
        }


        function displayDepots(data) {
            data.forEach(element => {
                //Idk but it can't find this item
                // var depotIcon = L.icon({
                //     iconUrl: '/wwwroot/resources/depot.png',

                //     iconSize:     [30, 30], // size of the icon // size of the shadow
                //     iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
                //       // the same for the shadow
                //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                // });

                c = element.coordinate.split(',');
                depot = L.marker([parseFloat(c[0]), parseFloat(c[1])]).bindPopup("Company Warehouse").openPopup().addTo(map);
            })
        }



        //get form change
        // document.getElementById('form').addEventListener('change', () => {
        //     const addresses = {}
        //     var formData = new FormData(document.querySelector('form'))
        //     formData.forEach(function(value, key) {

        //         addresses[key] = value;
        //     });
        //     updateMarker(addresses);
        //     GetDeliveries();
        // })

        document.getElementById('computeroutes').addEventListener('click', function (e) {
            let lines = []
            let dlines = []
            $.getJSON('api/delivery/ComputeRoutes', function (data) {
                console.log(data);
                data.forEach(element => {
                    console.log(element);
                    element.routeProp.forEach(e => {
                        l = e.split(",")
                        ll = [parseFloat(l[0]), parseFloat(l[1])]
                        lines.push(ll);
                    })
                })
                console.log(lines);
                L.polyline(lines, { color: getRandomColor() }).addTo(map);
            }).then(function () {
                $.getJSON('api/delivery/ComputeDeliveryRoutes', function (data) {
                    console.log(data);
                    data.forEach(element => {
                        console.log(element);
                        element.deliveryRouteProp.forEach(e => {
                            l = e.split(",")
                            ll = [parseFloat(l[0]), parseFloat(l[1])]
                            dlines.push(ll);
                        })
                    })
                    console.log(lines);
                    L.polyline(dlines, { color: getRandomColor() }).addTo(map);
                })
            });
        });

        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {};
            const formData = new FormData(document.getElementById('form'));
            formData.forEach(function (value, key) {
                data[key] = value;
            });

            //saveSchedule(sender.getLatLng(), receiver.getLatLng(), data);
            let id = document.getElementById('deliveryid').value;
            if (id) {
                //put request
                $.ajax({
                    url: '/api/delivery/patch/' + id,
                    type: 'patch',
                    data: $('#form').serialize(),
                    success: function () {
                        console.log("form patched");
                        document.getElementById('deliveryid').value = "";
                        downloadData();
                    },
                    error: function () {
                        console.log("offf")
                    }
                });

            }
            else {

                $.ajax({
                    url: '/api/delivery/post',
                    type: 'post',
                    data: $('#form').serialize(),
                    success: function () {
                        console.log("form posted");
                        downloadData();
                    }
                });


                deleteSender();
                deleteReceiver();
            }

            //drawSchedules();



            //console.log(schedules);


            //return false;
        });


        document.getElementById('form').reset();
        //GetDeliveries();
        downloadData();
        $.getJSON('api/delivery/LoadCompanyDepots', function (data) {
            displayDepots(data);

        });

    })();





});