import pandas as pd
import random
import string

# Función para generar un código único basado en la cédula
def generate_unique_code(cedula: str) -> str:
    last_five_digits = cedula[-5:]
    random_letters = ''.join(random.choices(string.ascii_uppercase, k=3))
    return f"{last_five_digits} {random_letters}"

# Función para convertir la fecha Excel a una fecha de Python
def excel_date_to_js_date(serial: float) -> str:
    # Fecha base de Excel: 1900-01-01
    delta_days = serial - 25569
    return (pd.to_datetime("1900-01-01") + pd.to_timedelta(delta_days, unit='D')).strftime('%Y-%m-%d')

# Función para calcular campos adicionales
def calculate_fields(client, payment_data):
    payment_info = next((item for item in payment_data if str(item['CODIGO_ID_SUJETO']).strip() == str(client['CODIGO_ID_SUJETO']).strip()), None)
    
    if not payment_info or not client["FECHA_CONCESION"]:
        return client

    credit_term = 0
    credit_term_str = payment_info.get("PLAZO DEL CREDITO", "").strip()

    if "MESES" in credit_term_str:
        credit_term = int(credit_term_str.split(" ")[0])
    elif "SEMANAL" in credit_term_str:
        weeks = int(credit_term_str.split(" ")[0])
        credit_term = (weeks + 3) // 4  # Aproximadamente, 4 semanas por mes

    start_date = pd.to_datetime(client["FECHA_CONCESION"], errors="coerce")
    if pd.isna(start_date):
        return client

    end_date = start_date + pd.DateOffset(months=credit_term)
    days_overdue = (pd.Timestamp.today() - end_date).days if pd.Timestamp.today() > end_date else 0

    next_payment_date = start_date + pd.DateOffset(days=30)

    operation_number = generate_unique_code(str(client['CODIGO_ID_SUJETO']))

    val_operacion = float(client.get("VAL_OPERACION", 0))
    val_a_vencer = float(client.get("VAL_A_VENCER", 0))
    val_vencido = val_operacion - val_a_vencer if val_a_vencer else val_operacion

    return {
        **client,
        "NUMERO DE OPERACION": operation_number,
        "NUM_DIAS_VENCIDOS": days_overdue,
        "FECHA_DE_VENCIMIENTO": end_date.strftime('%Y-%m-%d'),
        "FECHA_SIG_VENCIMIENTO": next_payment_date.strftime('%Y-%m-%d'),
        "VAL_VENCIDO": f"{val_vencido:.2f}",
        "VAL_A_VENCER": f"{val_a_vencer:.2f}" if val_a_vencer else f"{(val_operacion - val_vencido):.2f}",
    }

def process_excel(file_path, payment_file_path, output_file_path):
    # Leer los archivos Excel
    excel_data = pd.read_excel(file_path)
    payment_data = pd.read_excel(payment_file_path)

    # Procesar los datos de los clientes
    processed_data = []
    for _, client in excel_data.iterrows():
        processed_client = calculate_fields(client.to_dict(), payment_data.to_dict(orient='records'))
        processed_data.append(processed_client)

    # Crear un DataFrame con los datos procesados
    result_df = pd.DataFrame(processed_data)

    # Guardar los resultados en un nuevo archivo Excel
    result_df.to_excel(output_file_path, index=False, sheet_name='Datos Exportados')
    print(f"Archivo procesado guardado en: {output_file_path}")

if __name__ == "__main__":
    # Rutas de los archivos (ajustar según corresponda)
    file_path = "archivo_clientes.xlsx"
    payment_file_path = "archivo_pagos.xlsx"
    output_file_path = "archivo_procesado.xlsx"

    # Procesar los archivos Excel
    process_excel(file_path, payment_file_path, output_file_path)
