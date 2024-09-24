import  { Text } from './Text';
import  { Video } from './Video';
import  { Audio } from './Audio';

const mediaText = new Text('.media-content');
const mediaVideo = new Video('.media-content');
const mediaAudio = new Audio('.media-content');

mediaText.init();

mediaVideo.init();

mediaAudio.init();