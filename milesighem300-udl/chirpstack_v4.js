/**
 * Payload Decoder for Chirpstack and Milesight network server
 * 
 * Copyright 2021 Milesight IoT
 * Modified 2023-10-06 Leo Gaggl (leo@opensensing.com) for Chirpstack V4 compliance
 * 
 * @product EM310-UDL
 */
function decodeUplink(input) {
    var fPort = input.fPort;
    var bytes = input.bytes;
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // DISTANCE
        else if (channel_id === 0x03 && channel_type === 0x82) {
            decoded.distance = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // POSITION
        else if (channel_id === 0x04 && channel_type === 0x00) {
            decoded.position = bytes[i] === 0 ? "normal" : "tilt";
            i += 1;
        } else {
            break;
        }
    }

    return {data: decoded};
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}
