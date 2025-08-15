import nextConnect from 'next-connect';
import multer from 'multer';
import { speechToTextWithTimestamps, convertToSRT } from '../../lib/speech';
import fs from 'fs';

const upload = multer({ dest: '/tmp' });

const handler = nextConnect();

handler.use(upload.single('audio'));

handler.post(async (req, res) => {
  try {
    // 使用语音识别 API 生成带时间戳的字幕
    
    // 检查是否上传了文件
    if (!req.file) {
      return res.status(400).json({ error: '请上传音频文件' });
    }
    
    // 将音频转换为带时间戳的字幕
    const subtitles = await speechToTextWithTimestamps(req.file.path);
    
    // 转换为 SRT 格式
    const srtContent = convertToSRT(subtitles);
    
    // 设置响应头以下载文件
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=transcribed-subtitles.srt');
    
    // 返回字幕文件
    res.status(200).send(srtContent);
    
    // 清理临时文件
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '语音转字幕失败' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;