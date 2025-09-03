package xyz.vinllage.recycle.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import xyz.vinllage.file.constants.FileStatus;
import xyz.vinllage.file.controllers.RequestUpload;
import xyz.vinllage.file.entities.FileInfo;
import xyz.vinllage.file.repositories.FileInfoRepository;
import xyz.vinllage.file.services.FileUploadService;
import xyz.vinllage.member.entities.Member;
import xyz.vinllage.recycle.entities.DetectedRecycle;
import xyz.vinllage.recycle.repositories.DetectedRecycleRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DetectSaveService {

    private final FileInfoRepository fileInfoRepository;
    private final FileUploadService fileUploadService;
    private final DetectedRecycleRepository recycleFileDataRepository;
    private final ObjectMapper om;

    @Transactional
    public DetectedRecycle process(List<MultipartFile> files, String itemsJson, Member member) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }
        if (!StringUtils.hasText(itemsJson)) {
            throw new IllegalArgumentException("items(JSON) 값이 비어 있습니다.");
        }

        // 1) 파일 업로드: 동일 gid로 그룹화
        String gid = UUID.randomUUID().toString();
        RequestUpload form = new RequestUpload();
        form.setGid(gid);
        form.setFiles(files.toArray(MultipartFile[]::new));
        form.setSingle(false);     // 여러 파일
        form.setImageOnly(false);
        form.setLocation("detect");

        List<FileInfo> fileInfos = fileUploadService.process(form);
//        System.out.println("파일인포" + fileInfos);
        List<Map<String, String>> images = fileInfos.stream()
                .filter(FileInfo::isImage) // 이미지인 경우만
                .map(f -> Map.of(
                        "url", f.getFileUrl(),
                        "name", f.getFileName(),
                        "ext", f.getExtension()
                ))
                .toList();

        // 2) RecycleFileData 생성
        DetectedRecycle entity = new DetectedRecycle();
        entity.setGid(gid);
        entity.setMember(member);
        entity.setData(itemsJson); // 원본 JSON 문자열 그대로 저장
        try {
            String imagesJson = om.writeValueAsString(images);
            entity.setImageUrl(imagesJson);
        } catch (Exception e) {
            e.printStackTrace();
        }

        recycleFileDataRepository.saveAndFlush(entity);

        // 3) 파일 그룹 작업 완료 처리
        for (FileInfo f : fileInfos) {
            if (member != null) f.setStatus(FileStatus.DONE);
            else f.setStatus(FileStatus.CLEAR);
            fileInfoRepository.saveAndFlush(f);
        }

        return entity;
    }
}