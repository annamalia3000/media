import  { Text } from './Text';
import  { Video } from './Video';
import './addAudio/addAudio';

const mediaText = new Text('.media-content');
const mediaVideo = new Video('.media-content');

mediaText.initialize();

mediaVideo.initialize();