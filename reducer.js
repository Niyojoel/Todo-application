
function reducer (state, action) {
    if(action.type === 'CLEAR_LIST') {
        return {...state, cartList:[]};
    }
    else if( action.type === 'REMOVE_ITEM') {
        return {...state, cartList:state.cartList.filter(item => item.id !== action.payload)}
    }
    else if (action.type === 'CHANGE_COUNT') {
        return {...state, cartList: state.cartList.map((item)=> {
            if(item.id === action.payload.id) {
                if (action.payload.type === 'inc') {
                    return {...item, amount:item.amount + 1}
                 }else { return {...item, amount:item.amount - 1}
                };
            }
            return item;
        }).filter(item => item.amount !== 0)
    }

    }
    else if(action.type === 'CALCULATE') {
        const {total, amount} = state.cartList.reduce((agg,item)=> {
            const {price, amount} =item;
            agg.amount += amount; 
            agg.total += price * amount;
            return agg;
        }, {
            total:0,
            amount :0
        })
        return {...state, total:parseFloat(total.toFixed(2)), amount}
    }
    
    return state;
}

export default reducer;