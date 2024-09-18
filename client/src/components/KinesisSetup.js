import AWS from 'aws-sdk';

/**
 * Sets up AWS SDK and returns the Kinesis Video client.
 */
export const setupKinesisVideoClient = () => {
  AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  });

  return new AWS.KinesisVideo({
    region: process.env.REACT_APP_AWS_REGION,
  });
};

/**
 * Creates a Kinesis Video signaling channel.
 */
// export const createSignalingChannel = async (channelName) => {
//   const kinesisVideoClient = setupKinesisVideoClient();

//   try {
//     const response = await kinesisVideoClient.createSignalingChannel({
//       ChannelName: student-test-channel,
//       Type: 'SINGLE_MASTER',
//     }).promise();

//     console.log('Signaling Channel Created: ', response);
//     return response;
//   } catch (err) {
//     console.error('Error creating signaling channel: ', err);
//   }
// };

/**
 * Sends video stream to Kinesis Video Streams.
 */
export const sendStreamToKinesis = async (stream, streamName) => {
  const kinesisVideoClient = setupKinesisVideoClient();

  try {
    const mediaResponse = await kinesisVideoClient.putMedia({
      StreamName:streamName,
      Payload: stream,
    }).promise();

    console.log('Stream sent to Kinesis: ', mediaResponse);
  } catch (err) {
    console.error('Error sending stream to Kinesis: ', err);
  }
};
