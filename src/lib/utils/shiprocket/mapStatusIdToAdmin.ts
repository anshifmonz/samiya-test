export type CsvRow = {
  status_id: number | null;
  status: string | null;
  description: string | null;
  when_it_arises: string | null;
  follow_up_action: string | null;
  action: string | null;
};

export const CSV_BY_ID: Record<number, CsvRow> = {
  1: {
    status_id: 1,
    status: 'New',
    description: 'The order has been created but not yet processed.',
    when_it_arises: 'When a customer places a new order.',
    follow_up_action: 'Process the order and prepare it for invoicing or shipping.',
    action: 'Process order'
  },
  2: {
    status_id: 2,
    status: 'Invoiced',
    description: 'The order has been invoiced.',
    when_it_arises: 'After the order is processed and an invoice is generated.',
    follow_up_action: 'Confirm payment and prepare for shipping.',
    action: 'Confirm payment'
  },
  3: {
    status_id: 3,
    status: 'Ready To Ship',
    description: 'The order is ready to be shipped.',
    when_it_arises: 'Once the payment is confirmed and the order is packed.',
    follow_up_action: 'Schedule a pickup or ship the order.',
    action: 'Ship order'
  },
  4: {
    status_id: 4,
    status: 'Pickup Scheduled',
    description: 'Pickup for the order has been scheduled.',
    when_it_arises: 'After scheduling a pickup with the courier.',
    follow_up_action: 'Ensure the courier is ready for pickup on the scheduled date.',
    action: 'Wait for pickup'
  },
  5: {
    status_id: 5,
    status: 'Canceled',
    description: 'The order has been canceled.',
    when_it_arises: 'When the customer or seller decides to cancel the order.',
    follow_up_action: 'No further action needed unless the customer wants to reorder.',
    action: 'No action needed'
  },
  6: {
    status_id: 6,
    status: 'Shipped',
    description: 'The order has been shipped.',
    when_it_arises: 'Once the courier picks up the order and it is in transit.',
    follow_up_action: 'Provide tracking information to the customer and monitor the shipment status.',
    action: 'Track shipment'
  },
  7: {
    status_id: 7,
    status: 'Delivered',
    description: 'The order has been successfully delivered to the customer.',
    when_it_arises: 'When the courier delivers the order to the customer.',
    follow_up_action: 'Confirm delivery with the customer and request feedback.',
    action: 'Confirm delivery'
  },
  8: {
    status_id: 8,
    status: 'ePayment Failed',
    description: 'The electronic payment for the order has failed.',
    when_it_arises: 'When there is an issue with processing the payment (e.g., insufficient funds).',
    follow_up_action: 'Contact the customer to resolve payment issues and reattempt payment.',
    action: 'Resolve payment issue'
  },
  9: {
    status_id: 9,
    status: 'Returned',
    description: 'The order has been returned by the customer.',
    when_it_arises: 'When the customer decides to return the order for any reason.',
    follow_up_action: 'Process the return and update inventory accordingly.',
    action: 'Process return'
  },
  10: {
    status_id: 10,
    status: 'Unmapped',
    description: 'The order cannot be mapped to any existing status.',
    when_it_arises: 'When there is a system error or data mismatch in the order processing.',
    follow_up_action: 'Investigate the issue and resolve any mapping errors.',
    action: 'Investigate issue'
  },
  11: {
    status_id: 11,
    status: 'Unfulfillable',
    description: 'The order cannot be fulfilled due to various reasons (e.g., out of stock).',
    when_it_arises: 'When an item in the order is unavailable for shipping.',
    follow_up_action: 'Notify the customer and discuss alternatives or cancel the order.',
    action: 'Investigate issue, or cancel order'
  },
  12: {
    status_id: 12,
    status: 'Pickup Queue',
    description: 'The order is in the queue for pickup.',
    when_it_arises: 'When the order is ready for pickup but waiting for the courier to arrive.',
    follow_up_action: 'Monitor the pickup status and ensure timely collection by the courier.',
    action: 'Wait for pickup'
  },
  13: {
    status_id: 13,
    status: 'Pickup Rescheduled',
    description: 'The pickup for the order has been rescheduled.',
    when_it_arises: 'When the original pickup could not be completed and a new date is set.',
    follow_up_action: 'Confirm the new pickup date with the courier and notify the customer.',
    action: 'Reschedule pickup'
  },
  14: {
    status_id: 14,
    status: 'Pickup Error',
    description: 'There was an error during the pickup process.',
    when_it_arises: 'When the courier encounters an issue while attempting to pick up the order.',
    follow_up_action: 'Investigate the error, resolve the issue, and reschedule the pickup if necessary.',
    action: 'Create return request'
  },
  15: {
    status_id: 15,
    status: 'RTO Initiated',
    description: 'Return to Origin (RTO) process has been initiated for the order.',
    when_it_arises: 'When the order is being returned to the seller due to delivery failure or refusal.',
    follow_up_action: 'Monitor the RTO process and prepare for the return of the item.',
    action: 'Monitor RTO'
  },
  16: {
    status_id: 16,
    status: 'RTO Delivered',
    description: 'The order has been successfully returned to the seller.',
    when_it_arises: "When the returned item reaches the seller's location.",
    follow_up_action: 'Process the return, update inventory, and notify the customer about the return status.',
    action: 'Refund payment'
  },
  17: {
    status_id: 17,
    status: 'RTO Acknowledged',
    description: 'The return to origin (RTO) has been acknowledged by the seller.',
    when_it_arises: 'When the seller confirms receipt of the RTO request for the order.',
    follow_up_action: 'Update inventory and process any necessary refunds or exchanges for the customer.',
    action: 'Refund payment'
  },
  18: {
    status_id: 18,
    status: 'Cancellation Requested',
    description: 'A request to cancel the order has been made.',
    when_it_arises: 'When the customer or seller initiates a cancellation before shipping.',
    follow_up_action: 'Confirm the cancellation request and process it accordingly, notifying the customer.',
    action: 'Confirm cancellation'
  },
  19: {
    status_id: 19,
    status: 'Out for Delivery',
    description: 'The order is currently out for delivery to the customer.',
    when_it_arises: 'When the courier has picked up the order and is en route to the delivery address.',
    follow_up_action: 'Provide tracking information to the customer and ensure timely delivery.',
    action: 'Track delivery'
  },
  20: {
    status_id: 20,
    status: 'In Transit',
    description: 'The order is currently in transit to the delivery location.',
    when_it_arises: 'When the order has been picked up by the courier and is on its way to the customer.',
    follow_up_action: 'Monitor the shipment status and keep the customer informed about the estimated delivery time.',
    action: 'Track shipment'
  },
  21: {
    status_id: 21,
    status: 'Return Pending',
    description: 'The return request has been received but not yet processed.',
    when_it_arises: "When a customer initiates a return but it hasn't been acknowledged yet.",
    follow_up_action: 'Confirm the return request and prepare for processing it.',
    action: 'Confirm return request'
  },
  22: {
    status_id: 22,
    status: 'Return Initiated',
    description: 'The return process has been officially started.',
    when_it_arises: 'When the return request is approved and the return process is underway.',
    follow_up_action: 'Notify the customer about the return initiation and provide instructions for the return.',
    action: 'Notify customer'
  },
  23: {
    status_id: 23,
    status: 'Return Pickup Queued',
    description: 'The return item is in the queue for pickup by the courier.',
    when_it_arises: 'When the return item is ready for pickup but waiting for the courier to arrive.',
    follow_up_action: 'Monitor the pickup status and ensure timely collection by the courier.',
    action: 'No action needed, wait'
  },
  24: {
    status_id: 24,
    status: 'Return Pickup Error',
    description: 'There was an error during the return pickup process.',
    when_it_arises: 'When the courier encounters an issue while attempting to pick up the return item.',
    follow_up_action: 'Investigate the error, resolve the issue, and reschedule the pickup if necessary.',
    action: 'Reschedule pickup'
  },
  25: {
    status_id: 25,
    status: 'Return In Transit',
    description: 'The return item is currently in transit back to the seller.',
    when_it_arises: 'When the return item has been picked up by the courier and is on its way back.',
    follow_up_action: 'Monitor the return shipment status and keep the customer informed about the return process.',
    action: 'Track return'
  },
  26: {
    status_id: 26,
    status: 'Return Delivered',
    description: 'The return item has been successfully delivered back to the seller.',
    when_it_arises: "When the returned item reaches the seller's location.",
    follow_up_action: 'Process the return, update inventory, and notify the customer about the return status.',
    action: 'Refund payment'
  },
  27: {
    status_id: 27,
    status: 'Return Cancelled',
    description: 'The return request has been cancelled.',
    when_it_arises: 'When the customer or seller decides to cancel the return process.',
    follow_up_action: 'Confirm the cancellation and update the order status accordingly.',
    action: 'No action needed'
  },
  28: {
    status_id: 28,
    status: 'Return Pickup Generated',
    description: 'A pickup request for the return item has been generated.',
    when_it_arises: 'When the return pickup has been scheduled and is awaiting courier assignment.',
    follow_up_action: 'Notify the customer about the scheduled pickup and provide any necessary instructions.',
    action: 'Wait for pickup'
  },
  29: {
    status_id: 29,
    status: 'Return Cancellation Requested',
    description: 'A request to cancel the return has been made.',
    when_it_arises: 'When the customer or seller initiates a cancellation of the return process.',
    follow_up_action: 'Confirm the cancellation request and process it accordingly, notifying the customer.',
    action: 'Confirm cancellation'
  },
  30: {
    status_id: 30,
    status: 'Return Pickup Cancelled',
    description: 'The scheduled pickup for the return item has been cancelled.',
    when_it_arises: 'When the courier or seller cancels the pickup request for the return item.',
    follow_up_action: 'Inform the customer about the cancellation and reschedule the pickup if necessary.',
    action: 'Reschedule pickup'
  },
  31: {
    status_id: 31,
    status: 'Return Pickup Rescheduled',
    description: 'The pickup for the return item has been rescheduled.',
    when_it_arises: 'When the original pickup request was cancelled and a new pickup time is set.',
    follow_up_action: 'Notify the customer about the new pickup schedule and ensure the courier is informed.',
    action: 'Reschedule pickup'
  },
  32: {
    status_id: 32,
    status: 'Return Picked Up',
    description: 'The return item has been successfully picked up by the courier.',
    when_it_arises: 'When the courier collects the return item from the customer.',
    follow_up_action: 'Update the return status and inform the customer that the item is on its way back.',
    action: 'Track return'
  },
  33: {
    status_id: 33,
    status: 'Lost',
    description: 'The return item has been reported as lost during transit.',
    when_it_arises: 'When the courier cannot locate the return item during the return process.',
    follow_up_action: 'Investigate the loss, communicate with the courier, and inform the customer about the situation.',
    action: 'Investigate loss'
  },
  34: {
    status_id: 34,
    status: 'Out For Pickup',
    description: 'The courier is on the way to pick up the return item.',
    when_it_arises: 'When the courier has left to collect the return item from the customer.',
    follow_up_action: 'Inform the customer that the courier is on the way for pickup.',
    action: 'Wait for pickup'
  },
  35: {
    status_id: 35,
    status: 'Pickup Exception',
    description: 'There was an issue during the pickup process.',
    when_it_arises: 'When the courier encounters a problem while attempting to pick up the return item.',
    follow_up_action: 'Investigate the exception, resolve the issue, and reschedule the pickup if necessary.',
    action: 'Reschedule pickup'
  },
  36: {
    status_id: 36,
    status: 'Undelivered',
    description: 'The return item could not be delivered back to the seller.',
    when_it_arises: "When the return item fails to reach the seller's location for any reason.",
    follow_up_action: 'Determine the cause of non-delivery and take appropriate action to resolve the issue.',
    action: 'Investigate non-delivery'
  },
  37: {
    status_id: 37,
    status: 'Delivery Delayed',
    description: 'The delivery of the return item is delayed beyond the expected time.',
    when_it_arises: 'When the return item is not delivered within the anticipated timeframe.',
    follow_up_action: 'Communicate the delay to the customer and provide an updated estimated delivery time.',
    action: 'Notify customer'
  },
  38: {
    status_id: 38,
    status: 'Partial Delivered',
    description: 'Only part of the return shipment has been delivered.',
    when_it_arises: 'When some items from a return shipment arrive, but others do not.',
    follow_up_action: 'Notify the customer about the partial delivery and follow up on the remaining items.',
    action: 'Notify customer'
  },
  39: {
    status_id: 39,
    status: 'Destroyed',
    description: 'The return item has been destroyed during transit.',
    when_it_arises: 'When the return item is damaged beyond repair while being transported.',
    follow_up_action: 'Inform the customer about the destruction and discuss possible resolutions or compensations.',
    action: 'Notify customer'
  },
  40: {
    status_id: 40,
    status: 'Damaged',
    description: 'The return item has been damaged during transit.',
    when_it_arises: "When the return item arrives at the seller's location in a damaged condition.",
    follow_up_action: 'Assess the damage, communicate with the customer, and determine the next steps for resolution.',
    action: 'Assess damage'
  },
  41: {
    status_id: 41,
    status: 'Fulfilled',
    description: 'The order has been successfully completed and delivered.',
    when_it_arises: 'When the customer receives the order and the transaction is complete.',
    follow_up_action: 'Notify the customer about the successful delivery and request feedback if applicable.',
    action: 'No action needed'
  },
  42: {
    status_id: 42,
    status: 'Archived',
    description: 'The order has been archived and is no longer active.',
    when_it_arises: 'When the order is completed and no further action is required.',
    follow_up_action: 'No immediate action needed; maintain records for future reference if necessary.',
    action: 'No action needed'
  },
  43: {
    status_id: 43,
    status: 'Reached Destination Hub',
    description: 'The shipment has arrived at the destination hub.',
    when_it_arises: 'When the package reaches the local distribution center for final delivery.',
    follow_up_action: "Update the customer on the shipment's progress and provide an estimated delivery time.",
    action: 'Notify customer'
  },
  44: {
    status_id: 44,
    status: 'Misrouted',
    description: 'The shipment has been sent to the wrong location.',
    when_it_arises: 'When the package is incorrectly routed during transit.',
    follow_up_action: 'Investigate the misrouting, coordinate with the courier to redirect the shipment, and inform the customer.',
    action: 'Investigate routing'
  },
  45: {
    status_id: 45,
    status: 'RTO_OFD',
    description: 'Return to Origin - Out for Delivery.',
    when_it_arises: 'When the return item is on its way back to the seller.',
    follow_up_action: 'Notify the seller that the return is out for delivery and provide tracking information.',
    action: 'Track return'
  },
  46: {
    status_id: 46,
    status: 'RTO_NDR',
    description: 'Return to Origin - Non-Delivery Reported.',
    when_it_arises: 'When the return item could not be delivered back to the seller.',
    follow_up_action: 'Investigate the reason for non-delivery and take necessary actions to resolve the issue.',
    action: 'Investigate non-delivery'
  },
  47: {
    status_id: 47,
    status: 'Return Out For Pickup',
    description: 'The return item is scheduled for pickup by the courier.',
    when_it_arises: 'When the return pickup has been arranged and is awaiting courier assignment.',
    follow_up_action: 'Inform the customer about the scheduled pickup for the return item.',
    action: 'Wait for pickup'
  },
  48: {
    status_id: 48,
    status: 'Return Out For Delivery',
    description: 'The return item is on its way back to the seller.',
    when_it_arises: 'When the return item has been picked up and is being delivered back to the seller.',
    follow_up_action: 'Update the seller on the return shipment status and provide tracking information if available.',
    action: 'Track return'
  },
  49: {
    status_id: 49,
    status: 'Return Pickup Exception',
    description: 'There was an issue during the return pickup process.',
    when_it_arises: 'When the courier encounters a problem while attempting to pick up the return item.',
    follow_up_action: 'Investigate the exception, resolve the issue, and reschedule the pickup if necessary.',
    action: 'Reschedule pickup'
  },
  50: {
    status_id: 50,
    status: 'Return Undelivered',
    description: 'The return item could not be delivered back to the seller.',
    when_it_arises: "When the return item fails to reach the seller's location for any reason.",
    follow_up_action: 'Determine the cause of non-delivery and take appropriate action to resolve the issue.',
    action: 'Investigate non-delivery'
  },
  51: {
    status_id: 51,
    status: 'Picked Up',
    description: 'The return item has been successfully picked up by the courier.',
    when_it_arises: 'When the courier has collected the return item from the customer.',
    follow_up_action: 'Notify the customer that the return item has been picked up and is on its way back.',
    action: 'Track return'
  },
  52: {
    status_id: 52,
    status: 'Self Fulfilled',
    description: 'The order has been fulfilled by the seller without using the courier service.',
    when_it_arises: 'When the seller handles the delivery of the order independently.',
    follow_up_action: 'Confirm with the seller that the order has been fulfilled and update records accordingly.',
    action: 'No action needed'
  },
  53: {
    status_id: 53,
    status: 'Disposed Off',
    description: 'The return item has been disposed of and will not be returned.',
    when_it_arises: 'When the return item is no longer viable for return and has been discarded.',
    follow_up_action: 'Inform the customer about the disposal and discuss any possible resolutions or compensations.',
    action: 'Notify customer'
  },
  54: {
    status_id: 54,
    status: 'Canceled before Dispatched',
    description: 'The order has been canceled prior to being dispatched.',
    when_it_arises: 'When the order is canceled before it has been picked up or shipped.',
    follow_up_action: 'Notify the customer about the cancellation and confirm that no further action is needed.',
    action: 'No action needed'
  },
  55: {
    status_id: 55,
    status: 'RTO In-Transit',
    description: 'The return item is currently in transit back to the seller.',
    when_it_arises: 'When the return item is on its way back to the seller after being picked up.',
    follow_up_action: 'Update the seller on the return shipment status and provide tracking information if available.',
    action: 'Track return'
  },
  57: {
    status_id: 57,
    status: 'QC Failed',
    description: 'The shipment has failed quality control checks.',
    when_it_arises: 'When the package does not meet the required quality standards during inspection.',
    follow_up_action: 'Investigate the reasons for QC failure, rectify the issues, and possibly reschedule shipment.',
    action: 'Investigate QC failure'
  },
  58: {
    status_id: 58,
    status: 'Reached Warehouse',
    description: 'The shipment has arrived at the warehouse.',
    when_it_arises: 'When the package is received at the storage facility for processing.',
    follow_up_action: "Update the customer on the shipment's status and prepare for further processing or dispatch.",
    action: 'Notify customer'
  },
  59: {
    status_id: 59,
    status: 'Custom Cleared',
    description: 'The shipment has successfully cleared customs.',
    when_it_arises: 'When the package has passed through customs inspection and is ready for delivery.',
    follow_up_action: 'Notify the customer that the shipment has cleared customs and is on its way to the destination.',
    action: 'Notify customer'
  },
  60: {
    status_id: 60,
    status: 'In Flight',
    description: 'The shipment is currently in transit via air.',
    when_it_arises: 'When the package is on an aircraft en route to its destination.',
    follow_up_action: 'Provide tracking updates to the customer and inform them of the estimated arrival time.',
    action: 'Track shipment'
  },
  61: {
    status_id: 61,
    status: 'Handover to Courier',
    description: 'The shipment has been handed over to the courier for delivery.',
    when_it_arises: 'When the package is officially transferred to the courier service for final delivery.',
    follow_up_action: 'Notify the customer that the package is with the courier and provide tracking information.',
    action: 'Track shipment'
  },
  62: {
    status_id: 62,
    status: 'Booked',
    description: 'The shipment has been successfully booked for dispatch.',
    when_it_arises: 'When the order is confirmed and scheduled for pickup or shipment.',
    follow_up_action: 'Confirm the booking with the customer and provide details about the pickup or delivery schedule.',
    action: 'Confirm booking'
  },
  64: {
    status_id: 64,
    status: 'In Transit Overseas',
    description: 'The shipment is currently in transit to an international destination.',
    when_it_arises: 'When the package is being transported across international borders.',
    follow_up_action: 'Keep the customer informed about the international transit status and expected delivery time.',
    action: 'Track shipment'
  },
  65: {
    status_id: 65,
    status: 'Connection Aligned',
    description: 'The shipment is aligned for the next leg of its journey.',
    when_it_arises: 'When the package is ready for transfer to the next mode of transport or courier.',
    follow_up_action: "Update the customer on the shipment's progress and any changes in delivery timelines.",
    action: 'Notify customer'
  },
  66: {
    status_id: 66,
    status: 'Reached Overseas Warehouse',
    description: 'The shipment has arrived at the overseas warehouse.',
    when_it_arises: 'When the package is received at the international storage facility for processing.',
    follow_up_action: "Update the customer on the shipment's status and prepare for further processing or dispatch.",
    action: 'Notify customer'
  },
  67: {
    status_id: 67,
    status: 'Custom Cleared Overseas',
    description: 'The shipment has successfully cleared customs in the destination country.',
    when_it_arises: 'When the package has passed through customs inspection in the overseas location.',
    follow_up_action: 'Notify the customer that the shipment has cleared customs and is on its way to the final destination.',
    action: 'Notify customer'
  },
  68: {
    status_id: 68,
    status: 'RETURN ACKNOWLEDGED',
    description: 'The return request has been acknowledged by the system.',
    when_it_arises: 'When the return process has been initiated and confirmed.',
    follow_up_action: 'Inform the customer that their return request has been acknowledged and provide next steps.',
    action: 'No action needed'
  },
  69: {
    status_id: 69,
    status: 'Box Packing',
    description: 'The items are being packed into boxes for shipment.',
    when_it_arises: 'When the packaging process is underway for the order.',
    follow_up_action: 'Keep the customer updated on the packing status and expected dispatch time.',
    action: 'Pack order'
  },
  70: {
    status_id: 70,
    status: 'Pickup Booked',
    description: 'The pickup for the shipment has been successfully scheduled.',
    when_it_arises: 'When the courier has confirmed the pickup appointment for the order.',
    follow_up_action: 'Notify the customer about the scheduled pickup and provide any relevant details.',
    action: 'Wait for pickup'
  },
  71: {
    status_id: 71,
    status: 'DARKSTORE SCHEDULED',
    description: 'The order has been scheduled for processing in a dark store.',
    when_it_arises: 'When the order is set to be fulfilled from a dark store (a fulfillment center without a physical retail presence).',
    follow_up_action: "Update the customer on the order's status and expected processing time.",
    action: 'No action needed'
  },
  72: {
    status_id: 72,
    status: 'Allocation in Progress',
    description: 'The items for the order are being allocated from inventory.',
    when_it_arises: 'When the system is in the process of assigning stock to fulfill the order.',
    follow_up_action: 'Keep the customer informed about the allocation status and any potential delays.',
    action: 'Allocate stock'
  },
  73: {
    status_id: 73,
    status: 'FC Allocated',
    description: 'The fulfillment center has been allocated for the order.',
    when_it_arises: 'When the order is assigned to a specific fulfillment center for processing.',
    follow_up_action: 'Inform the customer about the allocation and expected dispatch timeline.',
    action: 'No action needed'
  },
  74: {
    status_id: 74,
    status: 'Picklist Generated',
    description: 'A picklist has been created for the items in the order.',
    when_it_arises: 'When the system generates a list of items to be picked for the order.',
    follow_up_action: "Update the customer on the order's progress and expected packing time.",
    action: 'Pick items'
  },
  75: {
    status_id: 75,
    status: 'Ready to Pack',
    description: 'The items are ready to be packed for shipment.',
    when_it_arises: 'When the order has been picked and is prepared for packing.',
    follow_up_action: 'Notify the customer that the order is ready for packing and provide an estimated dispatch time.',
    action: 'Pack order'
  },
  76: {
    status_id: 76,
    status: 'Packed',
    description: 'The order has been packed and is ready for shipment.',
    when_it_arises: 'When the items have been securely packed for delivery.',
    follow_up_action: 'Inform the customer that their order has been packed and is awaiting pickup or dispatch.',
    action: 'No action needed'
  },
  80: {
    status_id: 80,
    status: 'FC MANIFEST GENERATED',
    description: 'The manifest for the fulfillment center has been generated.',
    when_it_arises: 'When all items for a shipment have been compiled into a manifest for processing.',
    follow_up_action: "Update the customer on the order's status and inform them that it is moving to the next stage.",
    action: 'No action needed'
  },
  81: {
    status_id: 81,
    status: 'PROCESSED AT WAREHOUSE',
    description: 'The order has been processed at the warehouse.',
    when_it_arises: 'When the order has been picked and processed for shipment.',
    follow_up_action: 'Notify the customer that their order has been processed and is moving to the next stage.',
    action: 'No action needed'
  },
  82: {
    status_id: 82,
    status: 'PACKED EXCEPTION',
    description: 'There was an issue during the packing process.',
    when_it_arises: 'When an error occurs while packing the items for shipment.',
    follow_up_action: 'Investigate the issue, resolve it, and inform the customer about the delay and next steps.',
    action: 'Investigate packing issue'
  },
  83: {
    status_id: 83,
    status: 'HANDOVER EXCEPTION',
    description: 'There was an issue during the handover process to the courier.',
    when_it_arises: 'When the package could not be handed over to the courier for delivery.',
    follow_up_action: 'Check the reason for the exception, resolve it, and update the customer on the status.',
    action: 'Investigate handover issue'
  },
  87: {
    status_id: 87,
    status: 'RTO_LOCK',
    description: 'The order has been locked for Return to Origin (RTO) processing.',
    when_it_arises: 'When the order is marked for return to the original sender.',
    follow_up_action: 'Notify the customer about the RTO status and provide information on the return process.',
    action: 'Notify customer'
  },
  88: {
    status_id: 88,
    status: 'UNTRACEABLE',
    description: 'The shipment cannot be tracked at the moment.',
    when_it_arises: 'When the tracking information is unavailable or the shipment is lost.',
    follow_up_action: 'Inform the customer about the tracking issue and assure them that you are investigating the matter.',
    action: 'Investigate tracking'
  },
  89: {
    status_id: 89,
    status: 'ISSUE_RELATED_TO_THE_RECIPIENT',
    description: 'There is an issue concerning the recipient of the shipment.',
    when_it_arises: 'When the delivery cannot be completed due to problems related to the recipient (e.g., incorrect address, recipient unavailable).',
    follow_up_action: 'Investigate the issue, resolve it, and communicate with the recipient to clarify the situation.',
    action: 'Investigate recipient issue'
  },
  90: {
    status_id: 90,
    status: 'REACHED_BACK_AT_SELLER_CITY',
    description: "The shipment has returned to the seller's city.",
    when_it_arises: "When a shipment is returned to the seller's location after a failed delivery attempt.",
    follow_up_action: 'Notify the seller about the return and discuss the next steps for reshipping or handling the order.',
    action: 'Notify seller'
  }
};

export function getRowById(id: number): CsvRow | null {
  return CSV_BY_ID[id] ?? null;
}
