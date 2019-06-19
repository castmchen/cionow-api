#!/usr/bin/env node

"use strict"

const root = require( "../dist/server.js" )
const http = require( "http" )
const webSocket = require( "ws" )
const app = root.server.bootstrap( ).app
const httpServer = http.createServer( app )
httpServer.on( "error", onError )
const wss = new webSocket.Server( { noServer: true } )
const { socketService } = require( '../dist/services/socketService' )
wss.on( "connection", ( ws ) => {
    socketService.onConnection( ws )
} )
httpServer.on( 'upgrade', ( request, socket, head ) => {
    if ( request.url === '/realtime' ) {
        wss.handleUpgrade( request, socket, head, ( ws ) => {
            wss.emit( "connection", ws, request )
        } )
    } else {
        socket.destroy( )
    }
} )

const port = process.env.PORT || 1337
httpServer.listen( port )
console.log("Server running at http://localhost:%d", port)

function onError( error ) {
    if ( error.syscall !== "listen" ) {
        throw error
    }

    const bind = typeof httpPort === "string" ? "Pipe" + httpPort : "Port" + httpPort
    switch ( error.code ) {
        case "EACCES":
            console.error( bind + "requires elevated privileges" )
            process.exit( 1 )
            break
        case "EADDRINUSE":
            console.error( bind + "already is used" )
            process.exit( 1 )
            break
        default:
            throw error
    }
}
