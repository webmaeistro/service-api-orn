/* eslint-disable no-undef */

module.exports = async function orderPipelineStageChanged(payload) {
  console.log("Webhook: orderPipelineStageChanged");

  // const paypalCapture = require("../../services/payment-providers/paypal/capture-payment");
  // const paypalRefund = require("../../services/payment-providers/paypal/refund-payment");

  const {
    order: { get: order },
  } = payload;

  console.log("Order pipeline update for", order.id);
  console.log("The order is in", order.pipelines.length, "pipeline(s)");

  // Print out the different pipelines and their stage names
  const inPipelines = order.pipelines
    .filter((p) => !!p.pipeline.stages)
    .map(({ pipeline, stageId }) => {
      const { name } = pipeline;

      const stage = pipeline.stages.find((s) => s.id === stageId);
      const stageName = stage ? stage.name : "n/a";

      console.log(`- ${name} = ${stageName}`);

      return {
        name,
        stageName,
      };
    });

  // Example of a "In store" order pipeline
  const ornpipePipeline = inPipelines.find((p) => p.name === "ornpipe");
  if (ornpipePipeline) {
    switch (ornpipePipeline.stageName) {
      case "New":
        console.log("Notify staff of new order");
        break;
        case 'pakking':
          actions.push(
            'Inform the user: Boken blir pakket og gjort klar for sending '
          );
          break;
        case 'postet':
          // Vipps capture
          await getClient().capture({
            orderId: order.id,
            body: {
              merchantInfo: {
                merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL
              },
              transaction: {
                amount: (99 + order.total.gross) * 100,
                transactionText:
                  'Ørn forlag | ornforlag.no Vipps transaksjon: Betaling Utført'
              }
            }
          });

          await updateCrystallizeOrder({
            id: order.id,
            additionalInformation: JSON.stringify({
              status: 'CAPTURED'
            })
          });

          break;

        case 'refund':
          await getClient().refund({
            orderId: order.id,
            body: {
              merchantInfo: {
                merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL
              },
              transaction: {
                amount: (99 + order.total.gross) * 100,
                transactionText:
                  'Ørn forlag | ornforlag.no Vipps transaksjon: Refundert'
              }
            }
          });

          await updateCrystallizeOrder({
            id: order.id,
            additionalInformation: JSON.stringify({
              status: 'REFUNDED'
            })
          });

          break;

        case 'Cancelled':
          await getClient().canceled({
            orderId: order.id,
            body: {
              merchantInfo: {
                merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL
              },
              transaction: {
                amount: (99 + order.total.gross) * 100,
                transactionText:
                  'Ørn forlag | ornforlag.no Vipps transaksjon: Canceled'
              }
            }
          });

          await updateCrystallizeOrder({
            id: order.id,
            additionalInformation: JSON.stringify({
              status: 'CANCELD'
            })
          });
      }
    }
  };

    res.send('received');

