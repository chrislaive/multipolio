import socketIO from 'socket.io';

export default function (server){
    const io = socketIO(server);

    io.on('connection',function(socket){

        socket.on('joinGame',({room,name})=>{
            socket.join(room);
            if(name){
                socket.to(room).emit('updatePlayers',room);
                socket.to(room).emit('askTR',{name,room});
            }
        });

        socket.on('answerTR',({name,room,turn,round,positions})=>{
            socket.to(room).emit('answerTR',{name,turn,round,positions});
        });

        socket.on('activeStatus',({room})=>{
            socket.to(room).emit('updatePlayers',room);
        });

        socket.on('someoneBuy',({room,name,player})=>{
            socket.to(room).emit('updatePlayers',room);
            socket.to(room).emit('someoneBuy',{name,player});
        });

        socket.on('someoneNoBuy',({room})=>{
            socket.to(room).emit('someoneNoBuy',room);
        });

        socket.on('updateOthers',({room})=>{
            socket.to(room).emit('updateOthers',room);
        });

        socket.on('gameStarted',({room})=>{
            socket.to(room).emit('gameStarted',room);
        });

        socket.on('sendMessage',({room,name,message})=>{
            socket.to(room).emit('getMessage',{name,message})
        });

        socket.on('removePlayer',({room,id})=>{
            socket.to(id).emit('removeGame',{room});
        });

        socket.on('lossGame',({room,id})=>{
            socket.to(room).emit('lossGame',id);
            socket.to(room).emit('updatePlayers',room);
        });

        socket.on('rollDices',({room,dices,playerId})=>{
            socket.to(room).emit('getRoll',{dices,playerId});
        });

        socket.on('rollDobles',({room,dices})=>{
            socket.to(room).emit('getRollD',{dices});
        });

        socket.on('setPartial',({room,dices,turn})=>{
            socket.to(room).emit('setPartials',{dices,turn});
        });

        socket.on('updateTurns',({room,playersNT})=>{
            let players = playersNT.sort((a,b)=>a.turn-b.turn).map(e=>`Turno ${e.turn} - ${e.name}<br>`).toString().replace(/,/g,'')
            socket.to(room).emit('updateTurns',{players});
        });

    });
}