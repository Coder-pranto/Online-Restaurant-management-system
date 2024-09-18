const { createNewOrderService } = require("../services/createNewOrderService");
const CustomError = require("./customError");
const isCustomerInsideRestaurant = require("./customarLocationVerification");

const realTimeOrderProcessWithSocketIo = (io) => {
    // WebSocket connections handling
    io.on('connection', (socket) => {
        console.log('WebSocket connection successfull');

        // Handle new order events
        socket.on('newOrder', async(order) => {
            // console.log('New order received from client:', order);

            if(!order.customerCoords){
                io.emit('newOrderError', {error: 'Customer coordinates not found', tableNumber: order?.tableNumber});
                return;
            }
            // check customer location
            if (await isCustomerInsideRestaurant(order?.customerCoords, order.restaurantId)) {
                // save order to database
                createNewOrderService(order).then((orderFromDB) => {
                    // Broadcast the new order to all connected clients
                    io.emit('newOrder', orderFromDB);
                })
            } else {
                io.emit('newOrderError', {error: 'Order canceled! You are outside of restaurant.', tableNumber: order?.tableNumber});
                console.log('You are outside of restaurant')
            }
        });

        // Handle order status update events
        // socket.on('updateOrderStatus', (updatedOrder) => {
        //     console.log('Order status updated:', updatedOrder);

        //     // Broadcast the updated order status to all connected clients
        //     io.emit('updateOrderStatus', updatedOrder);
        // });
    });
};

module.exports = realTimeOrderProcessWithSocketIo;



 /* this for no coordinate checks*/
// const { createNewOrderService } = require("../services/createNewOrderService");

// const realTimeOrderProcessWithSocketIo = (io) => {
//     // WebSocket connections handling
//     io.on('connection', (socket) => {
//         console.log('WebSocket connection successful');

//         // Handle new order events
//         socket.on('newOrder', async(order) => {
//             console.log('New order received from client:', order);

//             // save order to database
//             try {
//                 const orderFromDB = await createNewOrderService(order);
//                 // Broadcast the new order to all connected clients
//                 io.emit('newOrder', orderFromDB);
//             } catch (error) {
//                 io.emit('newOrderError', {error: 'Failed to create new order', tableNumber: order?.tableNumber});
//                 console.error('Failed to create new order:', error);
//             }
//         });
//     });
// };

// module.exports = realTimeOrderProcessWithSocketIo;



