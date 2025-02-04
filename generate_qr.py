import json
import zlib
import qrcode
import qrcode.constants


def read_json_from_file(file_path):
    """Read JSON data from a file."""
    try:
        with open(file_path, 'r', encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{file_path}'.")
    except OSError as e:
        print(f"OS Error while reading '{file_path}': {e}")
    return None


def write_json_to_file(data, file_path):
    """Write JSON data to a file."""
    try:
        with open(file_path, 'w', encoding="utf-8") as file:
            json.dump(data, file, indent=4)
    except OSError as e:
        print(f"OS Error while writing to '{file_path}': {e}")
    except TypeError:
        print("Error: Data is not serializable to JSON.")


def compress_and_encode(data):
    """Compress and encode JSON data as a hexadecimal string."""
    try:
        json_str = json.dumps(data)
        compressed_data = zlib.compress(json_str.encode('utf-8'))
        return compressed_data.hex()
    except (TypeError, ValueError) as e:
        print(f"Compression error: {e}")
        return ""


def decode_and_decompress(encoded_data):
    """Decode from hexadecimal and decompress the data."""
    try:
        compressed_data = bytes.fromhex(encoded_data)
        json_str = zlib.decompress(compressed_data).decode('utf-8')
        return json.loads(json_str)
    except (ValueError, zlib.error, json.JSONDecodeError) as e:
        print(f"Decompression error: {e}")
        return None


def create_qr_code(data, filename="qrcode.png"):
    """Create and save a QR code with the given data."""
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img.save(filename)
        print(f"QR Code saved as {filename}")
    except (OSError, ValueError) as e:
        print(f"QR code generation error: {e}")


if __name__ == "__main__":
    json_file_path = "input.json"

    json_data = read_json_from_file(json_file_path)
    if not json_data:
        exit(1)  # Terminar si hay un error

    encoded_string = compress_and_encode(json_data)
    if not encoded_string:
        exit(1)

    create_qr_code(encoded_string)

    decoded_data = decode_and_decompress(encoded_string)
    if decoded_data is not None:
        print("Decoded Data:", decoded_data)

