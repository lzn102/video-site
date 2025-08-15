import nextConnect from 'next-connect';
import multer from 'multer';
import { mergeVideoAndAudio } from '../../lib/ffmpeg';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: '/tmp' });

const handler = nextConnect();

handler.use(upload.fields([{ name: 'video' }, { name: 'audio' }]));

handler.post(async (req, res) => {
  try {
    // 使用 FFmpeg 合并视频和音频文件
    
    // 检查是否上传了文件
    if (!req.files || !req.files.video || !req.files.audio) {
      return res.status(400).json({ error: '请上传视频文件和音频文件' });
    }
    
    const videoFile = req.files.video[0];
    const audioFile = req.files.audio[0];
    
    const outputPath = path.join('/tmp', `${Date.now()}-merged-video.mp4`);
    
    // 合并视频和音频
    await mergeVideoAndAudio(videoFile.path, audioFile.path, outputPath);
    
    // 读取合并后的视频文件并返回
    const videoBuffer = fs.readFileSync(outputPath);
    
    // 设置响应头以下载文件
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename=merged-video.mp4');
    
    // 返回合并后的视频文件
    res.status(200).send(videoBuffer);
    
    // 清理临时文件
    fs.unlinkSync(videoFile.path);
    fs.unlinkSync(audioFile.path);
    fs.unlinkSync(outputPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '视频和音频合并失败' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;