package xyz.vinllage.file.services;

import com.querydsl.core.BooleanBuilder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import xyz.vinllage.file.constants.FileStatus;
import xyz.vinllage.file.entities.FileInfo;
import xyz.vinllage.file.entities.QFileInfo;
import xyz.vinllage.file.exceptions.FileNotFoundException;
import xyz.vinllage.file.repositories.FileInfoRepository;
import xyz.vinllage.global.configs.FileProperties;
import xyz.vinllage.global.libs.Utils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@EnableConfigurationProperties(FileProperties.class)
public class FileInfoService {
    private final FileInfoRepository repository;
    private final HttpServletRequest request;
    private final FileProperties properties;
    private final Utils utils;

    /**
     * 파일 한개 조회
     *
     * @param seq : 파일 등록번호
     * @return
     */
    public FileInfo get(Long seq) {
        FileInfo item = repository.findById(seq).orElseThrow(FileNotFoundException::new);

        // 추가정보 공통 처리
        addInfo(item);

        return item;
    }

    public FileInfo get(String gid) {
        List<FileInfo> items = getList(gid);

        return items == null || items.isEmpty()? null : items.get(0);
    }

    /**
     * 파일 목록 조회
     *
     * @param gid : 그룹 ID
     * @param location : 그룹 내에서 구분 위치값
     * @return
     */
    public List<FileInfo> getList(String gid, String location, FileStatus status) {
        status = Objects.requireNonNullElse(status, FileStatus.ALL);

        QFileInfo fileInfo = QFileInfo.fileInfo;
        BooleanBuilder andBuilder = new BooleanBuilder();
        if (StringUtils.hasText(gid)) {
            andBuilder.and(fileInfo.gid.eq(gid));
        }
        if (StringUtils.hasText(location)) {
            andBuilder.and(fileInfo.location.eq(location));
        }

        if (status != FileStatus.ALL) {
            if (status == FileStatus.CLEAR || status == FileStatus.UNDONE) {
                andBuilder.and(fileInfo.status.in(FileStatus.CLEAR, FileStatus.UNDONE));
                andBuilder.and(fileInfo.createdAt.before(LocalDateTime.now().minusDays(1L)));
            } else {
                andBuilder.and(fileInfo.status.eq(FileStatus.DONE));
            }
        }

        List<FileInfo> items = (List<FileInfo>)repository.findAll(andBuilder, fileInfo.createdAt.asc());

        // 추가정보공통 처리
        items.forEach(this::addInfo);

        return items;
    }

    public List<FileInfo> getList(String gid, String location) {
        return getList(gid, location, FileStatus.DONE); // 그룹파일 완료 파일만
    }

    public List<FileInfo> getList(String gid) {
        return getList(gid, null);
    }

    /**
     * 추가 정보 처리
     * 1) 파일이 위치하고 있는 서버쪽 경로
     * 2) 브라우저에서 접근 가능한 URL
     * 3) 이미지인 경우 썸네일 이미지 URL
     * @param item
     */
    public void addInfo(FileInfo item) {
        item.setFilePath(getFilePath(item));

        /* 파일이 이미지인지 체크 */
        String contentType = item.getContentType();
        item.setImage(StringUtils.hasText(contentType) && contentType.startsWith("image"));

        /* 이미지인 경우 썸네일 기본 URL, 기본 Path  추가 */
        try {
            item.setFileUrl(getFileUrl(item));
            if (item.isImage()) {
                item.setThumbBaseUrl(utils.getUrl("/file/thumb?seq=" + item.getSeq()));
            }
            item.setFileDownloadUrl(utils.getUrl("/file/download/" + item.getSeq()));
        } catch (IllegalStateException e) {
            // 스케줄러 같은 비웹 환경에서는 URL 세팅 스킵
        }
    }

    public String folder(FileInfo item) {
        long seq = item.getSeq();

        return folder(seq);
    }

    public String folder(long seq) {
        return String.valueOf(seq % 10L); // 0 ~ 9
    }

    // 브라우저에서 접근할 수 있는 URL
    public String getFileUrl(FileInfo item) {
        return utils.getUrl(String.format("%s/%s/%s", properties.getUrl(), folder(item), item.getSeq() + Objects.requireNonNullElse(item.getExtension(), "")));
    }

    // 파일이 위치한 서버 경로
    public String getFilePath(FileInfo item) {
        return String.format("%s/%s/%s", properties.getPath(), folder(item), item.getSeq() + Objects.requireNonNullElse(item.getExtension(), ""));
    }
}