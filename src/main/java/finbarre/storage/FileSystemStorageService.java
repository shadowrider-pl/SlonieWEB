package finbarre.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import finbarre.domain.Slonie;
import finbarre.repository.SlonieRepository;
import finbarre.service.SlonieService;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

@Component
@Service
public class FileSystemStorageService implements StorageService {

	private final Path rootLocation;

	private final Logger log = LoggerFactory.getLogger(FileSystemStorageService.class);
	private final SlonieRepository slonieRepository;
	boolean passed = true;

	@Autowired
	public FileSystemStorageService(StorageProperties properties, SlonieRepository slonieRepository) {
		this.rootLocation = Paths.get(properties.getLocation());
		this.slonieRepository = slonieRepository;
	}

	@Override
	public void store(MultipartFile file) {
		try {
			if (file.isEmpty()) {
				throw new StorageException("Failed to store empty file " + file.getOriginalFilename());
			}
			Files.copy(file.getInputStream(), this.rootLocation.resolve(file.getOriginalFilename()));
		} catch (IOException e) {
			throw new StorageException("Failed to store file " + file.getOriginalFilename(), e);
		}
	}

	@Override
	public Stream<Path> loadAll() {
		try {
			return Files.walk(this.rootLocation, 1).filter(path -> !path.equals(this.rootLocation))
					.map(path -> this.rootLocation.relativize(path));
		} catch (IOException e) {
			throw new StorageException("Failed to read stored files", e);
		}

	}

	@Override
	public Path load(String filename) {
		return rootLocation.resolve(filename);
	}

	@Override
	public Resource loadAsResource(String filename) {
		try {
			Path file = load(filename);
			Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new StorageFileNotFoundException("Could not read file: " + filename);

			}
		} catch (MalformedURLException e) {
			throw new StorageFileNotFoundException("Could not read file: " + filename, e);
		}
	}

	@Override
	public void deleteAll() {
		FileSystemUtils.deleteRecursively(rootLocation.toFile());
	}

	@Override
	public void init() {
		try {
			Files.createDirectory(rootLocation);
		} catch (IOException e) {
			throw new StorageException("Could not initialize storage", e);
		}
	}

	public void delete(String file) throws IOException {

		file = "upload-dir/" + file;

		Path fileToDeletePath = Paths.get(file);
		Files.delete(fileToDeletePath);
	}

	public long count(String filename) throws IOException {

		log.debug("Request to add logs from file : {}", filename);
		long result = 0;
		List<String> readLinesFromFile = readLinesFromFile(filename);
		SlonieService slon = new SlonieService();
		result = slon.policz(readLinesFromFile);
		Slonie slonie=new Slonie();
		slonie.setPlik(filename);
		slonie.setWynik(result);

        slonieRepository.save(slonie);
        
		return result;
	}

	public List<String> readLinesFromFile(String filename) throws IOException {
		filename = "upload-dir/" + filename;
		Path filePath = Paths.get(filename);
		List<String> lines = Files.readAllLines(filePath);
		return lines;
	}
}
