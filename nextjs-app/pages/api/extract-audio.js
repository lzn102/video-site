import nextConnect from 'next-connect';
import multer from 'multer';
import { extractAudioFromVideo } from '../../lib/ffmpeg';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: '/tmp' });

const handler = nextConnect();

handler.use(upload.single('video'));

handler.post(async (req, res) => {
  try {
    // 使用 FFmpeg 从视频中提取音频
    
    // 检查是否上传了文件
    if (!req.file) {
      return res.status(400).json({ error: '请上传视频文件' });
    }
    
    const outputPath = path.join('/tmp', `${Date.now()}-extracted-audio.mp3`);
    
    // 提取音频
    await extractAudioFromVideo(req.file.path, outputPath);
    
    // 读取音频文件并返回
    const audioBuffer = fs.readFileSync(outputPath);
    
    // 设置响应头以下载文件
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename=extracted-audio.mp3');
    
    // 返回音频文件
    res.status(200).send(audioBuffer);
    
    // 清理临时文件
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(outputPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '音频提取失败' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;